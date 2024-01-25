//  import { multiaddr } from '@multiformats/multiaddr';
//  import { PeerRecord, RecordEnvelope } from '@libp2p/peer-record';

/*

This is the CDN link to the library, use it in an HTML file:

```html
    <script src="https://cdn.jsdelivr.net/npm/@libp2p/peer-record/dist/index.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@multiformats/multiaddr/dist/index.min.js">
```

The library is now available in the global scope as `Libp2pPeerRecord` and `MultiformatsMultiaddr`

```js
    const g = globalThis as any;
    const PeerRecord = g.Libp2pPeerRecord.PeerRecord;
    const RecordEnvelope = g.Libp2pPeerRecord.RecordEnvelope;
    const multiaddr = g.MultiformatsMultiaddr.multiaddr;
```
*/
 
 
//  const activeMultiaddrs = libp2pNode.getMultiaddrs()
//  const multiaddr1 = multiaddr('/dns/localhost/tcp/0/wss/p2p-webrtc-star/p2p/' + peerIdCreate )
//  const multiaddr2 = multiaddr('/dns/localhost/tcp/0/wss/p2p/' + peerIdCreate )
//  const multiAddrs = [
//    activeMultiaddrs[0], 
//    multiaddr1,
//    multiaddr2
//  ]

//  const pr = new PeerRecord({
//    peerId: libp2pNode.peerId,
//    multiaddrs: multiAddrs
//  })

//  const envelope = await RecordEnvelope.seal(pr, libp2pNode.peerId)
//  console.log('Envelope: ', envelope)
//  const marshalled = envelope.marshal()

//  const resp = await libp2pNode.peerStore.consumePeerRecord(marshalled)
//  console.log('Peer record: ', resp)