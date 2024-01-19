
import { createEd25519PeerId } from '@libp2p/peer-id-factory'

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


async function generatePeerId() {
  const peerId = await createEd25519PeerId()
  console.log(peerId.toString())
  return peerId
}

const peerIdCreate = await generatePeerId()