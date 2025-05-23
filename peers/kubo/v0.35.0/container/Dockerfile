FROM ipfs/kubo:v0.35.0

VOLUME /data/ipfs

CMD [ "daemon", \
    "--migrate=true", \
    "--enable-gc=true", \
    "--enable-pubsub-experiment" \
]

EXPOSE 4001 4002 4003 5001 8080