import { generateKeyPair } from '@libp2p/crypto/keys'; 
// import { keys } from '@libp2p/crypto';
import { AbortOptions, Ed25519PeerId, PeerId, PrivateKey } from '@libp2p/interface';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';
import { CID, MultihashDigest } from 'multiformats';

// const { generateKeyPair } = keys;

/*
The CDN link for the crypto library (to be used in raw HTML)

```html
<script src="https://unpkg.com/@libp2p/crypto/dist/index.min.js"></script>
```

This will make the library available globally as `Libp2pCrypto`.

```js
const g = globalThis as any;
const { generateKeyPair } = g.Libp2pCrypto;

```
*/


interface Ed25519PublicKey {
  /**
   * The type of this key
   */
  readonly type: 'Ed25519'

  /**
   * The raw public key bytes
   */
  readonly raw: Uint8Array

  /**
   * Returns `true` if the passed object matches this key
   */
  equals(key?: any): boolean

  /**
   * Returns this public key as an identity hash containing the protobuf wrapped
   * public key
   */
  toMultihash(): MultihashDigest<0x0>

  /**
   * Return this public key as a CID encoded with the `libp2p-key` codec
   *
   * The digest contains an identity hash containing the protobuf wrapped
   * version of the public key.
   */
  toCID(): CID<unknown, 0x72, 0x0, 1>

  /**
   * Verify the passed data was signed by the private key corresponding to this
   * public key
   */
  verify(data: Uint8Array, sig: Uint8Array, options?: AbortOptions): boolean | Promise<boolean>

  /**
   * Returns this key as a multihash with base58btc encoding
   */
  toString(): string
}


interface Ed25519PrivateKey {
  /**
   * The type of this key
   */
  readonly type: 'Ed25519'

  /**
   * The public key that corresponds to this private key
   */
  readonly publicKey: Ed25519PublicKey

  /**
   * The raw private key bytes
   */
  readonly raw: Uint8Array

  /**
   * Returns `true` if the passed object matches this key
   */
  equals(key?: any): boolean

  /**
   * Sign the passed data with this private key and return the signature for
   * later verification
   */
  sign(data: Uint8Array, options?: AbortOptions): Uint8Array | Promise<Uint8Array>
}


async function generateEd25519PeerId(): Promise<{
    id: string;
    privateKey: Ed25519PrivateKey;
}> {
  const privateKey: Ed25519PrivateKey = await generateKeyPair("Ed25519");
  const id = peerIdFromPrivateKey(privateKey);
  return { id: id.toString(), privateKey };
}

interface Secp256k1PublicKey {
  /**
   * The type of this key
   */
  readonly type: 'secp256k1'

  /**
   * The raw public key bytes
   */
  readonly raw: Uint8Array

  /**
   * Returns `true` if the passed object matches this key
   */
  equals(key?: any): boolean

  /**
   * Returns this public key as an identity hash containing the protobuf wrapped
   * public key
   */
  toMultihash(): MultihashDigest<0x0>

  /**
   * Return this public key as a CID encoded with the `libp2p-key` codec
   *
   * The digest contains an identity hash containing the protobuf wrapped
   * version of the public key.
   */
  toCID(): CID<unknown, 0x72, 0x0, 1>

  /**
   * Verify the passed data was signed by the private key corresponding to this
   * public key
   */
  verify(data: Uint8Array, sig: Uint8Array, options?: AbortOptions): boolean | Promise<boolean>

  /**
   * Returns this key as a multihash with base58btc encoding
   */
  toString(): string
}

interface Secp256k1PrivateKey {
  /**
   * The type of this key
   */
  readonly type: 'secp256k1'

  /**
   * The public key that corresponds to this private key
   */
  readonly publicKey: Secp256k1PublicKey

  /**
   * The raw private key bytes
   */
  readonly raw: Uint8Array

  /**
   * Returns `true` if the passed object matches this key
   */
  equals(key?: any): boolean

  /**
   * Sign the passed data with this private key and return the signature for
   * later verification
   */
  sign(data: Uint8Array, options?: AbortOptions): Uint8Array | Promise<Uint8Array>
}

async function generateSecp256k1PeerId(): Promise<{
    id: string;
    privateKey: Secp256k1PrivateKey;
}> {
  const privateKey: Secp256k1PrivateKey = await generateKeyPair("secp256k1");
  const id = peerIdFromPrivateKey(privateKey);
  return { id: id.toString(), privateKey };
}


export {
    generateEd25519PeerId,
    generateSecp256k1PeerId,
    type Ed25519PublicKey,
    type Ed25519PrivateKey,
    type Secp256k1PublicKey,
    type Secp256k1PrivateKey
};