# `IPFS-liftoff 🚀 `
> Tools &amp; Examples for IPFS, IPFS-Cluster, Libp2p, OrbitDB, Bacalhua...

## Table of Contents
- [Overview](#overview)
- [Goal](#whats-the-goal)
- [Application Stack](#application-stack)

## Overview

This repository contains tools and examples for IPFS, Libp2p, OrbitDB, Bacalhau, and other distributed computing technologies.  Included are `Dockerfiles`, `docker-compose.yaml` files, `package.json` and other configuration files to help you get started.

### Sections

1. [`peers/`](./peers/) - client/server examples, organized by project and version
2. [`deploy/`](./deploy/) - deployments for various use-cases & infrastructures
3. [`tools/`](./tools/) - tools and code snippets for working with libp2p, ipfs, orbitdb...


## What's the Goal?

>  Exemplify a **distributed computing framework** that allows you to run your code, store files, utilize databases, serve content and applications in a **trustless peer-to-peer** manner.

### Why P2P?

- Cost Efficiency
- Fault Tolerance
- Scalability
- Privacy
- Security
- Performance
- Standardization

### Standards

1. Access is permissionless and censorship resistant
    - Based on the DID standard. [[https://www.w3.org/TR/did-core/](https://www.w3.org/TR/did-core/)]

2. Data is verifiable and immutable
    - Utilizing CIDs [[https://github.com/multiformats/cid](https://github.com/multiformats/cid)]

3. Computation is secure, private, fault tolerant, and future proof
    - Compute Over Data [[https://docs.bacalhau.org/](https://docs.bacalhau.org/)]

4. Network is scalable, performant, and cost efficient.
    - Interconnectivity by libp2p [[https://github.com/libp2p/specs/](https://github.com/libp2p/specs/)]


## Application Stack

### `Libp2p` - P2P Networking Framework

LibP2P allows the creation of a network of nodes that can communicate with each other without the need for a central server. This is the basis for decentralized applications (DApps) and peer-to-peer (P2P) networks.

### `IPFS` - InterPlanetary File System

Built on top of LibP2P, IPFS is a distributed file system that seeks to connect all computing devices with the same system of files. In some ways, IPFS is similar to the Web, but IPFS could be seen as a single BitTorrent swarm, exchanging objects within one Git repository. In other words, IPFS provides a high throughput content-addressed block storage model, with content-addressed hyperlinks. This forms a generalized Merkle DAG, a data structure upon which one can build versioned file systems, blockchains, and even a Permanent Web.

### `OrbitDB` - Distributed Database

OrbitDB is a serverless, distributed, peer-to-peer database. OrbitDB uses IPFS as its data storage and IPFS Pubsub to automatically sync databases with peers. It's an eventually consistent database that uses CRDTs for conflict-free database merges making OrbitDB an excellent choice for decentralized apps (dApps), blockchain applications and offline-first web applications.

### `Bacalhau` - Distributed Computing

Bacalhau is a distributed computing framework that allows you to run your code in a distributed manner. It is built on top of IPFS and OrbitDB. It is a framework that allows you to run your code in a distributed manner. Docker containers and WASM are supported. The output is stored on IPFS, returning the CID.


## Questions? Corrections? Suggestions?
Please open an issue or submit a pull request.  Thanks!