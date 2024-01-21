import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

/*
The following dependencies are pulled using script tags in public/index.html

Example:
```html
  <script src="https://unpkg.com/libp2p/dist/index.min.js"></script>
```
*/

const g = globalThis as any;
const autoNAT = g.Libp2PAutonat.autoNAT;
const bootstrap = g.Libp2PBootstrap.bootstrap;
const circuitRelayTransport = g.Libp2PCircuitRelayV2.circuitRelayTransport;
const createLibp2p = g.Libp2P.createLibp2p;
const dcutr = g.Libp2PDcutr.dcutr;
const gossipsub = g.ChainsafeLibp2PGossipsub.gossipsub;
const identify = g.Libp2PIdentify.identify;
const ipnsSelector = g.Ipns.ipnsSelector;
const ipnsValidator = g.Ipns.ipnsValidator;
const kadDHT = g.Libp2PKadDht.kadDHT;
const mplex = g.Libp2PMplex.mplex;
const noise = g.ChainsafeLibp2PNoise.noise;
const ping = g.Libp2PPing.ping;
const removePublicAddressesMapper = g.Libp2PKadDht.removePublicAddressesMapper;
const webRTC = g.Libp2PWebrtc.webRTC;
const webSockets = g.Libp2PWebsockets.webSockets;
const webTransport = g.Libp2PWebtransport.webTransport;
const yamux = g.ChainsafeLibp2PYamux.yamux;


var isRunning: Boolean = false;

const loadIPFS = async () => {

  const bootstrapConfig = { 
    list: [
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
  }

  const libp2pNode = await createLibp2p({
    // addresses: {
    //   listen: [
    //     '/ip4/0.0.0.0/tcp/0/ws',
    //     '/dns4/signal.ipfs.trnkt.xyz/tcp/443/wss/p2p-webrtc-star/'
    //   ],
    // },
    transports: [
      webSockets(),
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 2
      }),
      webTransport()
    ], 
    connectionEncryption: [
        noise()
    ],
    streamMuxers: [
        yamux(),
        mplex()
    ],
    services: {
      pubsub: gossipsub(),
      autoNAT: autoNAT(),
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
      dcutr: dcutr(),
      ping: ping()
    },
    peerDiscovery: [
        bootstrap(bootstrapConfig),
    ],
    connectionGater: {
      denyDialMultiaddr: async () => {
        return false
      }
    }
  });

  console.log('libp2p has started')
  const listenAddrs = libp2pNode.getMultiaddrs()
  console.log('libp2p is listening on the following addresses: ', listenAddrs)

  await libp2pNode.addEventListener('peer:discovery', async (evt: any) => {
    console.log('Discovered %s',evt.detail.id.toString()) // Log discovered peer
  })

  await libp2pNode.addEventListener('peer:connect', async (evt: any) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  })

  libp2pNode.addEventListener('peer:update', (evt: any) => {  
    console.log('Peer updated: ', evt.detail)  // Log peer updated
  })

  await libp2pNode.addEventListener('peer:disconnect', async (evt: any) => {
    console.log('Disconnected from %s', evt.detail.toString()) // Log disconnected peer
  })
}

const checkIPFS = () => {
  if (isRunning) {
    console.log('IPFS is already running')
    return true
  }
  return false
}

const App: React.FC = () => {
  useEffect( () => {
    // check if ipfs is already running
    if (checkIPFS() === true) { return; }

    loadIPFS().then(() => {
      console.log('IPFS is running')
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
