# `ipfs-liftoff 🛸 `
Tools &amp; Examples for IPFS, Libp2p, OrbitDB, Bacalhua...

## Overview

This repository contains tools and examples for IPFS, Libp2p, OrbitDB, Bacalhau, and other distributed computing technologies.  Included are `Dockerfiles`, `docker-compose.yaml` files, `package.json` and other configuration files to help you get started.

- P2P Client/Server Examples found in `peers/`.  Peers are organized by project and version.


## Application Stack

### `Libp2p` - P2P Networking Framework

P2P allows the creation of a network of nodes that can communicate with each other without the need for a central server. This is the basis for decentralized applications (DApps) and peer-to-peer (P2P) networks.

### `IPFS` - InterPlanetary File System

Built on top of libp2p, IPFS is a distributed file system that seeks to connect all computing devices with the same system of files. In some ways, IPFS is similar to the Web, but IPFS could be seen as a single BitTorrent swarm, exchanging objects within one Git repository. In other words, IPFS provides a high throughput content-addressed block storage model, with content-addressed hyperlinks. This forms a generalized Merkle DAG, a data structure upon which one can build versioned file systems, blockchains, and even a Permanent Web.

IPFS combines a distributed hashtable, an incentivized block exchange, and a self-certifying namespace. IPFS has no single point of failure, and nodes do not need to trust each other.

### `OrbitDB` - Distributed Database

OrbitDB is a serverless, distributed, peer-to-peer database. OrbitDB uses IPFS as its data storage and IPFS Pubsub to automatically sync databases with peers. It's an eventually consistent database that uses CRDTs for conflict-free database merges making OrbitDB an excellent choice for decentralized apps (dApps), blockchain applications and offline-first web applications.

### `Bacalhau` - Distributed Computing

Bacalhau is a distributed computing framework that allows you to run your code in a distributed manner. It is built on top of IPFS and OrbitDB. It is a framework that allows you to run your code in a distributed manner. Docker containers and WASM are supported. The output is stored IPFS, returning the CID.