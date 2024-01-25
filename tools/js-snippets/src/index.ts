import { generatePeerIdFactory } from './generatePeerId'

export async function main() {
  const peerId = await generatePeerIdFactory()
  console.log(peerId.toString())
}

main().then( () => {
  console.log('Done')
})