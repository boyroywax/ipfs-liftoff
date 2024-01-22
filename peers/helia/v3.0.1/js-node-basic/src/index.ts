import { autoNAT } from '@libp2p/autonat';
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { identify } from '@libp2p/identify'
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { mdns } from '@libp2p/mdns';
import { noise } from '@chainsafe/libp2p-noise'
import { tcp } from '@libp2p/tcp';
import { uPnPNAT } from '@libp2p/upnp-nat'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { yamux } from '@chainsafe/libp2p-yamux'
import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'


async function createNode() {

  const bootstrapConfig = {
    list: [
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
  }

  const libp2p = await createLibp2p({
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
      circuitRelayTransport({
        discoverRelays: 2
      }),
      webRTC()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      mplex(),   // Phasing out, No longer supported by Kubo
      yamux()
    ],
    services: {
      pubsub: gossipsub(),
      autonat: autoNAT(),
      upnpNAT: uPnPNAT(),
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
      mdns()
    ],
    connectionGater: {
      denyDialMultiaddr: async () => {
        return false
      }
    }
  })

  // await libp2p.start()

  const helia = await createHelia({
    libp2p
  })

  const pins = helia.pins
  console.log('pins: ', pins)

  console.log('libp2p has started')
  const listenAddrs = libp2p.getMultiaddrs()
  console.log('libp2p is listening on the following addresses: ', listenAddrs)

  libp2p.addEventListener('peer:discovery', async (evt: any) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
  })

  libp2p.addEventListener('peer:connect', async (evt: any) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  })

}

createNode().then(() => {
  console.log('Node created successfully...')
}).catch((err) => {
  console.error(err)
})
