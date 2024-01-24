#!/bin/sh

set -e
set -x
user=ipfs

export CLUSTER_CONSENSUS=${CLUSTER_CONSENSUS:-crdt}
export CLUSTER_DATASTORE="${CLUSTER_DATASTORE:-pebble}"

if [ -z "$CLUSTER_DATA_PATH" ]; then
    echo "IPFS_CLUSTER_PATH not set. Using default value"
    export CLUSTER_DATA_PATH=${DATA_DIR:-/data}${CLUSTER_FOLDER:-/ipfs-cluster}
fi

if [ id -u -eq 0 ]; then
    echo "Changing user to $user"
    # ensure directories are writable
    su-"$user" test -w "${CLUSTER_DATA_PATH}" || chown -R -- "$user" "${CLUSTER_DATA_PATH}"
    gosu "$user" "$0" $@
fi

if [ -f "${CLUSTER_DATA_PATH}/service.json" ] ; then
    echo "Found IPFS cluster configuration at ${CLUSTER_DATA_PATH}"
else
    echo "IPFS cluster configuration not found at ${CLUSTER_DATA_PATH}"
    echo "Initializing default configuration..."
    ipfs-cluster-service init --consensus "crdt" --datastore "pebble"
fi

if [ ! -f "${CLUSTER_DATA_PATH}/identity.json" ] ; then
    # backup the original service.json
    mv ${CLUSTER_DATA_PATH}/service.json /data/service.json

    echo "Identity not found at ${CLUSTER_DATA_PATH}, generating new identity..."
    ipfs-cluster-service init --consensus "${CLUSTER_CONSENSUS}" --datastore "${CLUSTER_DATASTORE}"
    
    # replace the original service.json
    cp ${CLUSTER_DATA_PATH}/service.json ${CLUSTER_DATA_PATH}/service.json
fi

if [ ${OVERWRITE_CONFIG} ]; then
    echo "Overwriting IPFS cluster configuration..."
    if [ -e "${CLUSTER_DATA_PATH}/service.json" ]; then
        cp /data/service.json ${CLUSTER_DATA_PATH}/service.json
    fi
fi

if [ -e "${CLUSTER_DATA_PATH}/cluster.lock" ]; then
    rm /data/ipfs-cluster/cluster.lock
fi

# sleep 10000
exec ipfs-cluster-service daemon --upgrade --leave 