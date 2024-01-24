#!/bin/sh

set -e
set -x
user=ipfs

echo "Starting IPFS Node..."
mkdir -p /data/ipfs && chown -R ipfs /data/ipfs



echo "Initializing IPFS..."
if [ -f /data/ipfs/config ]; then
    if [ -f /data/ipfs/repo.lock ]; then
        rm /data/ipfs/repo.lock
    fi
else
    echo "Initializing new IPFS config..."
    ipfs init --profile=badgerds,server
    ipfs config Routing.Type dht
    ipfs config Routing.AcceleratedRouting true
    ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
    ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
    ipfs config --json Swarm.ConnMgr.HighWater 2000
    ipfs config --json Datastore.BloomFilterSize 1048576
    ipfs config Datastore.StorageMax 10GB
fi

# Start the IPFS Cluster daemon in the foreground
echo "Starting IPFS Cluster daemon..."
exec ipfs daemon --enable-pubsub-experiment --migrate=true
