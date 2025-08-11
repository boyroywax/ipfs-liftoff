#!/bin/sh

set -e
set -x
user=ipfs

IPFS_SCRIPTS_PATH=${DATA_DIR:-/data}${SCRIPTS_DIR:-/scripts}${IPFS_NODE_DIR:-/ipfs}

$IPFS_SCRIPTS_PATH/node-bootstrap/startup.sh

# exec ipfs $@