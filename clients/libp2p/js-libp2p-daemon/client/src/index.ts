import { createClient } from '@libp2p/daemon-client'
import { multiaddr } from '@multiformats/multiaddr'

const serverAddr = multiaddr('/ip4/127.0.0.1/tcp/51440')
const client = createClient(serverAddr)

// interact with the daemon
let identify
try {
    identify = await client.identify()
    console.log('identify:', identify)

} catch (err) {
    console.error('identify error:', err)
}

// close the socket
// await client.close()