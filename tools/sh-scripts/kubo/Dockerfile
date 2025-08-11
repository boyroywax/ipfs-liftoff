FROM ipfs/kubo:v0.35.0

# Get the ENV variables - Node
ENV IPFS_NODE_SWARM_PROTECTOR_KEY=${IPFS_NODE_SWARM_PROTECTOR_KEY:-"swarm.key"}
ENV DATA_DIR=${DATA_DIR:-/data}
ENV IPFS_DATA_PATH=${DATA_DIR:-/data}${IPFS_NODE_DIR:-/ipfs}
ENV IPFS_TEMP_PATH=${DATA_DIR:-/data}${TEMP_DIR:-/tmp}${IPFS_NODE_DIR:-/ipfs}
ENV SCRIPTS_PATH=${DATA_DIR:-/data}${SCRIPTS_DIR:-/scripts}
ENV IPFS_SCRIPTS_PATH=${SCRIPTS_PATH}${IPFS_NODE_DIR:-/ipfs}
ENV IPFS_BACKUP_PATH=${DATA_DIR:-/data}${BACKUP_DIR:-/backup}${IPFS_NODE_DIR:-/ipfs}

# Creath the cluster node's initial data paths
RUN mkdir -p ${DATA_DIR}
RUN mkdir -p ${SCRIPTS_PATH}

# Create the volume paths
RUN mkdir -p ${IPFS_DATA_PATH}
RUN mkdir -p ${IPFS_SCRIPTS_PATH}
RUN mkdir -p ${IPFS_TEMP_PATH}
RUN mkdir -p ${IPFS_BACKUP_PATH}

# Mount the node volumes
VOLUME [ ${IPFS_DATA_PATH} ]
VOLUME [ ${IPFS_TEMP_PATH} ]
VOLUME [ ${IPFS_BACKUP_PATH} ]
VOLUME [ ${IPFS_SCRIPTS_PATH} ]

# Add the ipfs user  - Already part of the container
# RUN adduser -D -h ${DATA_DIR} -u 1000 ipfs

# Set the permissions for the ipfs user
RUN chown -R ipfs ${DATA_DIR}

# Copy the entrypoint file to the main data path
COPY entrypoint.sh ${DATA_DIR}/entrypoint.sh
RUN chmod +x ${DATA_DIR}/entrypoint.sh

# Set the permissions for the scripts
RUN chown -R ipfs $SCRIPTS_PATH

# Copy the config and swarm key files to temporary locations
COPY ./config/config ${SCRIPTS_PATH}/config/config.new
COPY ./config/swarm.key ${SCRIPTS_PATH}/config/${IPFS_NODE_SWARM_PROTECTOR_KEY}.new

# Expose the ipfs-daemon port
EXPOSE 4001 5001 8080

# Set the command
CMD [ "daemon", "--migrate=true", "--enable-gc=true", "--enable-pubsub-experiment" ]

# Set the entrypoint
ENTRYPOINT ["/bin/sh", "-c", "$DATA_DIR/entrypoint.sh"]
