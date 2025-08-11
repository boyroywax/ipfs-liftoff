import { createServer } from '@libp2p/daemon-server'
import { createLibp2p } from 'libp2p'
import { multiaddr } from '@multiformats/multiaddr'

import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { kadDHT } from '@libp2p/kad-dht'
import { mdns } from '@libp2p/mdns';
import { noise } from '@chainsafe/libp2p-noise'
import { tcp } from '@libp2p/tcp';
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { yamux } from '@chainsafe/libp2p-yamux'
import { ping } from '@libp2p/ping'
import { identify } from '@libp2p/identify'

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
        circuitRelayTransport(),
        webRTC()
    ],
    connectionEncrypters: [
        noise()
    ],
    streamMuxers: [
        yamux()
    ],
    services: {
        identify: identify(),
        ping: ping(),
        dht: kadDHT({
            clientMode: true,
        }),
        pubsub: gossipsub(),
    },
    peerDiscovery: [
        bootstrap(bootstrapConfig),
        mdns()
    ],
})

const serverMultiaddr = multiaddr('/ip4/0.0.0.0/tcp/54357')
// @ts-ignore
const server = createServer(serverMultiaddr, libp2p)  

server.start().then(() => {
    console.log('libp2p-daemon started on:')
    console.log(server.getMultiaddr())
})