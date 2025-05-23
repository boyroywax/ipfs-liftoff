# Kubo

Kubo is the reference implementation of the InterPlanetary File System (IPFS) protocol, written in Go. It enables distributed, peer-to-peer storage and sharing of data using content addressing. Kubo nodes can connect to the global IPFS network, exchange files, and participate in decentralized web applications.

## Features

- Content-addressed storage
- Peer-to-peer file sharing
- Distributed hash table (DHT) for peer discovery
- HTTP API and CLI tools
- Support for pinning and garbage collection

## Quick Start
> Docker

To get started with Kubo, you can run it using Docker. The following command will start a Kubo node:

```sh
docker run -d --name ipfs-node \
  -v /path/to/ipfs:/data/ipfs \
  -p 4001:4001 \
  -p 8080:8080 \
  ipfs/kubo:v0.35.0
```
This command will create a new container named `ipfs-node`, mount the local directory `/path/to/ipfs` to `/data/ipfs` in the container, and expose the necessary ports for IPFS communication.

> Docker Compose
To run Kubo with Docker Compose, you can use the following `docker-compose.yml` file:

```yaml
version: '3.7'
services:
  ipfs:
    image: ipfs/kubo:v0.35.0
    container_name: ipfs-node
    volumes:
      - /path/to/ipfs:/data/ipfs
    ports:
      - "4001:4001"
      - "8080:8080"
    command: daemon
```
To start the Kubo node, run:

```sh
docker-compose up -d
```
This will start the Kubo node in detached mode.

## Configuration
Kubo's configuration is stored in the `data/ipfs/config` file. You can modify this file to change various settings, such as network configuration, API settings, and more.
It may be necessary to remove the `data/ipfs/blocks`, `data/ipfs/datastore`, and `data/ipfs/keystore` directories if you are upgrading from a previous version of Kubo or changing those configurations.

## Upgrading
When upgrading from a previous version of Kubo, it is recommended to back up your data and configuration files. You may need to remove certain directories (e.g., `blocks`, `datastore`, `keystore`) if you encounter issues after the upgrade.

## Troubleshooting
If you encounter issues while running Kubo, check the logs for error messages. You can view the logs using the following command:

```sh
docker logs ipfs-node
```


## Documentation

- [Kubo Documentation](https://docs.ipfs.tech/reference/kubo/)
- [IPFS Concepts](https://docs.ipfs.tech/concepts/)
- [Kubo GitHub Repository](https://github.com/ipfs/kubo)

## References

1. [Kubo Release Notes](https://github.com/ipfs/kubo/releases)
2. [IPFS Project Homepage](https://ipfs.tech/)
3. [Kubo API Reference](https://docs.ipfs.tech/reference/kubo/rpc/)