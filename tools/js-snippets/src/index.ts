import { generatePeerIdFactory, generateKeys } from './generatePeerId'

export async function main() {
    await generatePeerIdFactory()
    await generateKeys()

}

main().then( () => {
  console.log('Done')
})