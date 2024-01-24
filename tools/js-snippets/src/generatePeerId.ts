
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
import { createPeerId } from '@libp2p/peer-id'
import { Ed25519PeerId } from '@libp2p/interface'

/* 
This is the CDN link to the library, use it in an HTML file:

```html
  <script src="https://cdn.jsdelivr.net/npm/@libp2p/peer-id-factory/dist/index.min.js"></script>
```

The library is now available in the global scope as `Libp2pPeerIdFactory`

```js
  const g = globalThis as any;
  const createEd25519PeerId = g.Libp2PPeerIdFactory.createEd25519PeerId;
```
*/


async function generatePeerIdFactory() {
  const peerId = await createEd25519PeerId()
  console.log(peerId.toString())
  return peerId
}

generatePeerIdFactory().then( (peerId: Ed25519PeerId) => {
  console.log(peerId.toString())
})

// async function generatePeerId() {
//   const peerId = createPeerId({ type: 'Ed25519' })
//   console.log('PeerId: ', peerId)
//   console.log('PrivateKey: ', peerId.privKey)
//   console.log('PublicKey: ', peerId.pubKey)
//   return peerId
// }

// generatePeerId().then( (peerId: PeerId) => {
//   console.log(peerId.toString())
// })

// export default generatePeerId