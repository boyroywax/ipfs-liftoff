import { createClient } from '@libp2p/daemon-client'
import { multiaddr } from '@multiformats/multiaddr'

const serverAddr = multiaddr('/ip4/0.0.0.0/tcp/54357')
const client = createClient(serverAddr)

// interact with the daemon
let identify
try {
    identify = await client.identify()
    console.log('identify:', identify)
    console.log('peers: ', await client.listPeers())
} catch (err) {
    console.error('identify error:', err)
}

// close the socket
// await client.close()