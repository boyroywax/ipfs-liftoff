# Basic LibP2P Client

This is a basic LibP2P client that can connect to other public peers.

## Quickstart - Run the Container Image
```sh
docker-compose up --build
```

## Usage

### Install dependencies

```sh
npm install
```

### Build the client

```sh
npm run build
```

### Run the client

```sh
npm start
```

## Configuration

### Install the node-js packages

>
> Use the `package.json` file to install the pinned versions of the packages.
> ```sh
> npm install
> ```
>

Or, install the latest versions of the packages (not recommended, but provided for convenience):
```sh
npm install -g npm@latest && \
npm install \
    "@chainsafe/libp2p-gossipsub@latest" \
    "@chainsafe/libp2p-noise@latest" \
    "@chainsafe/libp2p-yamux@latest" \
    "@libp2p/autonat@latest" \
    "@libp2p/bootstrap@latest" \
    "@libp2p/circuit-relay-v2@latest" \
    "@libp2p/dcutr@latest" \
    "@libp2p/identify@latest" \
    "@libp2p/kad-dht@latest" \
    "@libp2p/mdns@latest" \
    "@libp2p/mplex@latest" \
    "@libp2p/tcp@latest" \
    "@libp2p/upnp-nat@latest" \
    "@libp2p/webrtc@latest" \
    "@libp2p/websockets@latest" \
    "@libp2p/webtransport@latest" \
    "@types/node@latest" \
    "ipns@latest" \
    "libp2p@latest"
```



### Bootstrap nodes

The client will connect to the following public bootstrap nodes:

```typescript
const bootstrapConfig = { list: [
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
    "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
]}
```

### Listen addresses

The client will listen on the following addresses:

```typescript
addresses: {
    listen: [
        '/ip4/0.0.0.0/udp/0/',
        '/ip4/0.0.0.0/udp/0/quic-v1',
        '/ip4/0.0.0.0/udp/0/quic-v1/webtransport',
        '/ip4/0.0.0.0/tcp/0/ws/',
        '/ip4/0.0.0.0/tcp/0',
        '/webrtc',
    ],
},
```

### Transports

The client will use the following transports:

```typescript
transports: [
    webSockets(),
    webTransport(),
    tcp(),
    circuitRelayTransport(),
    webRTC()
],
```

### Connection Encryption

The client will use the following connection encryptions:

```typescript
connectionEncryption: [
    noise()
],
```

### Stream Multiplexers

The client uses the following stream multiplexers:

```typescript
streamMuxers: [
    mplex(),   // Phasing out, No longer supported by Kubo
    yamux()
],
```

### Peer Discovery

The client will use the following peer discovery mechanisms:

```typescript
peerDiscovery: [
    bootstrap(),
    mdns()
],
```

### Connection Gater

The client will use the following connection gater:

```typescript
connectionGater: {
    denyDialMultiaddr: async () => {
        return false        // Allow all dial multiaddrs
    }
}
```

### Services

Many services can be used to make the node discoverable.  The following services are used to exemplify the use of services:

```typescript
services: {
    pubsub: gossipsub(),
    autonat: autoNAT(),
    upnpNAT: uPnPNAT(),
    identify: identify(),
    dht: kadDHT({
        clientMode: false,
        validators: {
            ipns: ipnsValidator
        },
        selectors: {
            ipns: ipnsSelector
        }
    }),
    lanDHT: kadDHT({
        protocol: '/ipfs/lan/kad/1.0.0',
        peerInfoMapper: removePublicAddressesMapper,
        clientMode: false
    }),
    relay: circuitRelayServer({
        advertise: true
    }),
    dcutr: dcutr(),
},
```

> 🌳 View the complete [JS LibP2P API](https://libp2p.github.io/js-libp2p/index.html)