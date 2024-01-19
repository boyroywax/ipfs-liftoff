# libp2p WebRTC Star Signalling Server

## Build


### Presetup Image

This image uses the ```libp2p/js-libp2p-webrtc-star:latest``` image as a base.

```Dockerfile
FROM libp2p/js-libp2p-webrtc-star:latest

ENV DOMAIN "signal.ipfs.example.xyz"
ENV VIRTUAL_HOST "signal.ipfs.example.xyz"
ENV VIRTUAL_PORT "9090"

EXPOSE 9090
```

The following is the ```Dockerfile``` used to build the ```libp2p/webrtc-star-server:latest``` image.

```Dockerfile
FROM node:lts-alpine as node

# Switch to the node user for installation
RUN npm install -g @libp2p/webrtc-star-signalling-server

# webrtc-star defaults to 9090
EXPOSE 9090

# Available overrides (defaults shown):
#   --port=9090 --host=0.0.0.0 --disableMetrics=false
# Server logging can be enabled via the DEBUG environment variable:
#   DEBUG=signalling-server,signalling-server:error
CMD [ "webrtc-star" ]


## References

[1] Archived Libp2p WebRTC Star Signalling Server - (https://github.com/libp2p/js-libp2p-webrtc-star)[https://github.com/libp2p/js-libp2p-webrtc-star]

[2] Archived Libp2p WebRTC Star Signalling Server Deployment Doc - (https://github.com/libp2p/js-libp2p-webrtc-star/blob/master/packages/webrtc-star-signalling-server/DEPLOYMENT.md)[https://github.com/libp2p/js-libp2p-webrtc-star/blob/master/packages/webrtc-star-signalling-server/DEPLOYMENT.md]