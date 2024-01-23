import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { autoNAT } from '@libp2p/autonat'
import { tcp } from '@libp2p/tcp'
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { webRTC } from '@libp2p/webrtc'
import { bootstrap } from '@libp2p/bootstrap'
import { ipnsValidator } from 'ipns/validator'
import { ipnsSelector } from 'ipns/selector'
import { mdns } from '@libp2p/mdns'
import { mplex } from '@libp2p/mplex'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createOrbitDB } from '@orbitdb/core'


async function createNode() {
  const datastore = new MemoryDatastore()
  const blockstore = new MemoryBlockstore()

  const bootstrapConfig = {
    list: [
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
  }

  const libp2pNode = await createLibp2p({
    addresses: {
      listen: [
        '/ip4/0.0.0.0/udp/0/',
        '/ip4/0.0.0.0/udp/0/quic-v1',
        '/ip4/0.0.0.0/udp/0/quic-v1/webtransport',
        '/ip4/0.0.0.0/tcp/0/ws/',
        '/ip4/0.0.0.0/tcp/0',
        '/webrtc',
      ],
    },
    transports: [             
      webSockets(),  
      webTransport(),        
      tcp(),                  
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 2
      }),            
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    services: {    
      pubsub: gossipsub({
        allowPublishToZeroPeers: true
      }),           
      autonat: autoNAT(),     
      identify: identify(),
      upnpNAT: uPnPNAT(),
      dht: kadDHT({
        clientMode: false,
        validators: {
          ipns: ipnsValidator
        },
        selectors: {
          ipns: ipnsSelector
        }
      }),
      lanDHT: kadDHT({
        protocol: '/ipfs/lan/kad/1.0.0',
        peerInfoMapper: removePublicAddressesMapper,
        clientMode: false
      }),
      relay: circuitRelayServer({
        advertise: true
      }),
      dcutr: dcutr(),
    },
    peerDiscovery: [
      bootstrap(bootstrapConfig),
      mdns(),
    ],
    connectionGater: {
      denyDialMultiaddr: async () => {
        return false
      }
    }
  })

  const helia = await createHelia({
    blockstore,
    datastore,
    libp2p: libp2pNode,
  })

  const orbitdb = await createOrbitDB({
    ipfs: helia
  })

  const db = await orbitdb.open('test-development')

  await db.add('hello world 1')
  await db.add('hello world 2')

  console.log(await db.all())


  const listenAddrs = libp2pNode.getMultiaddrs()
  console.log('libp2p is listening on the following addresses: ', listenAddrs)

  libp2pNode.addEventListener('peer:discovery', async (evt: any) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
  })

  libp2pNode.addEventListener('peer:connect', (evt: any) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  })
}

createNode().then(() => {
  console.log('Node created and OrbitDB opened successfully...')
}).catch((err) => {
  console.error(err)
})

  // Close your db and stop OrbitDB and IPFS.
  // await db.close()
  // await orbitdb.stop()
  // await helia.stop()