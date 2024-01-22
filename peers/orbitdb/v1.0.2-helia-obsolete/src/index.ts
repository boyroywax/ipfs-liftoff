import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { autoNAT } from '@libp2p/autonat';
import { tcp } from '@libp2p/tcp';
import { kadDHT } from '@libp2p/kad-dht'
import { webRTC } from '@libp2p/webrtc'
import { preSharedKey } from '@libp2p/pnet'
import { bootstrap } from '@libp2p/bootstrap'
import { ipnsValidator } from 'ipns/validator';
import { ipnsSelector } from 'ipns/selector';
import { mdns } from '@libp2p/mdns';
import { mplex } from '@libp2p/mplex'
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { createHelia } from 'helia'
import { createOrbitDB, useIdentityProvider } from '@orbitdb/core'
import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import fs from 'fs'


async function createNode() {
  const datastore = new MemoryDatastore()
  const blockstore = new MemoryBlockstore()

  const swarmKey = fs.readFileSync('/usr/app/webapp/build/swarm.key')

  const Protector = preSharedKey({
    psk: swarmKey
  })

  const bootstrapConfig = {
    list: [
      "/dnsaddr/bootstrap.ipfs.trnkt.xyz/tcp/4001/",
      "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/",
      "/dnsaddr/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/12D3KooWDRmmGtJksoRrbuETHUAWRTDvkZiykEQtUdBHj3Vg2Ha6",
      "/dnsaddr/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/12D3KooWLMWGmGf6LEsVvtJTAoSogfbiHqQzsPfJvAC3kE7ikkP6",
      "/dnsaddr/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/12D3KooWNFkQH6PeC2zsuSrDd3S9FDMNaqePumUEoSvxceJJYtjf",
      "/dnsaddr/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/12D3KooWHSiT24kaXquLa4HB2h9eGtnXRAryWMZjinbe7yt5ihUd",
      "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWDRmmGtJksoRrbuETHUAWRTDvkZiykEQtUdBHj3Vg2Ha6",
      "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWLMWGmGf6LEsVvtJTAoSogfbiHqQzsPfJvAC3kE7ikkP6",
      "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWNFkQH6PeC2zsuSrDd3S9FDMNaqePumUEoSvxceJJYtjf",
      "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWHSiT24kaXquLa4HB2h9eGtnXRAryWMZjinbe7yt5ihUd"
    ]
  }

  const libp2pNode = await createLibp2p({
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/5001',
        '/ip4/0.0.0.0/tcp/5003/ws/',
        '/webrtc'
      ],
    },
    transports: [             
      webSockets(),          
      tcp(),                  
      webRTC()                
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    connectionProtector: Protector,
    services: {    
      pubsub: gossipsub({ allowPublishToZeroPeers: true }),           
      autonat: autoNAT(),     
      identify: identify(),   
      dht: kadDHT({
        clientMode: false,
        validators: {
          ipns: ipnsValidator
        },
        selectors: {
          ipns: ipnsSelector
        }
      }),
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

  const seed = new Uint8Array([157, 94, 116, 198, 19, 248, 93, 239, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245])

  OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
  useIdentityProvider(OrbitDBIdentityProviderDID)
  const didProvider = new Ed25519Provider(seed)
  const provider = OrbitDBIdentityProviderDID({ didProvider })
  const orbitdb = await createOrbitDB({ ipfs: helia, identity: { provider } })

  const db = await orbitdb.open('trnkt-master')

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
  console.log('Node created and connected to signal server')
}).catch((err) => {
  console.error(err)
})

  // Close your db and stop OrbitDB and IPFS.
  // await db.close()
  // await orbitdb.stop()
  // await helia.stop()