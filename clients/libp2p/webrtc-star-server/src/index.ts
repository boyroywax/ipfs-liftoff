import { sigServer } from '@libp2p/webrtc-star-signalling-server'

const server = await sigServer({
  port: 9090,
  host: '0.0.0.0',
  metrics: false
})

server.start().then(() => {
  console.log('Server started')
})

// some time later
// await server.stop()