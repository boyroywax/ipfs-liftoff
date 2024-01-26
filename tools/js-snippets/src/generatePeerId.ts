
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
import * as Libp2PCrypto from '@libp2p/crypto'
import { peerIdFromKeys } from '@libp2p/peer-id'
import { identity } from 'multiformats/hashes/identity'

// import { Ed25519PeerId } from '@libp2p/interface'

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

/*
This is the CDN link to the library, use it in an HTML file:

```html
  <script src="https://cdn.jsdelivr.net/npm/libp2p-crypto/dist/index.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/libp2p-crypto-secp256k1/dist/index.min.js"></script>
```

The library is now available in the global scope as `Libp2pCrypto` and `Libp2pCryptoSecp256k1`

```js
  const g = globalThis as any;
  const generateKeyPair = g.Libp2pCrypto.keys.generateKeyPair;
  const secp256k1 = g.Libp2pCryptoSecp256k1;
```
*/

/*
This is the CDN link to the library, use it in an HTML file:

```html
  <script src="https://unpkg.com/multiformats/dist/index.min.js"></script>
```

The library is now available in the global scope as `Multiformats`

```js
  const g = globalThis as any;
  const multihash = g.Multiformats.multihash;
```
*/



async function generatePeerIdFactory() {
  const peerId = await createEd25519PeerId()
  console.log(peerId.toString())

  const decoder = new TextDecoder('utf-8')
  console.log((decoder.decode(peerId.privateKey)).toString())
  const publicKeyHex = Buffer.from(peerId.publicKey).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  console.log(publicKeyHex)
  console.log((Buffer.from(peerId.publicKey)).toString())
  // console.log(multihash.decode(Buffer.from(peerId.publicKey)))
  const id = identity.digest(Buffer.from(peerId.publicKey))
  console.log((Buffer.from(id.digest).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')))

  const privateKeyHex = Buffer.from(peerId.privateKey).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  console.log(privateKeyHex)
  return peerId
}

async function generateKeys() {
  const keys = await Libp2PCrypto.keys.generateKeyPair('RSA', 1024)
  console.log("PeerId: ", await keys.id())

  const peerId = await peerIdFromKeys(keys.public.bytes, keys.bytes)
  console.log("PeerId: ", peerId)

  // const decoder = new TextDecoder('')
  console.log("PrivateKey: ", (keys.marshal().toString()))
  console.log("PublicKey: ", keys.public.marshal().toString())
  // return keys
  const publicKeyHex = Buffer.from(peerId.publicKey).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  console.log(publicKeyHex)

  const privateKeyHex = Buffer.from(peerId.privateKey).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  console.log(privateKeyHex)

  // now encode with base64
  const publicKeyBase64 = Buffer.from(publicKeyHex, 'hex').toString('base64');
  console.log(publicKeyBase64)

  const privateKeyBase64 = Buffer.from(privateKeyHex, 'hex').toString('base64');
  console.log(privateKeyBase64)
}

// generatePeerIdFactory().then( (peerId: Ed25519PeerId) => {
//   console.log(peerId.toString())
// })

// async function generatePeerId() {
//   console.log('PeerId: ', peerId)
//   console.log('PrivateKey: ', peerId.privKey)
//   console.log('PublicKey: ', peerId.pubKey)
//   return peerId
// }

// generatePeerId().then( (peerId: PeerId) => {
//   console.log(peerId.toString())
// })

export { generatePeerIdFactory, generateKeys }