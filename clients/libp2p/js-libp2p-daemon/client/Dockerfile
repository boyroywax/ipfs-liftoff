FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

RUN apt update && \ 
    apt install -y git

COPY package*.json ./

RUN npm install -g npm@10.3.0 \
    typescript \
    es-main

RUN npm install \
    "@chainsafe/libp2p-gossipsub@11.0.0" \
    "@libp2p/daemon-protocol@6.0.0" \
    "@libp2p/interface@1.0.0" \
    "@libp2p/kad-dht@11.0.0" \
    "@libp2p/logger@4.0.0" \
    "@libp2p/peer-id@4.0.0" \
    "@libp2p/tcp@9.0.0" \
    "@multiformats/multiaddr@12.1.3" \
    "it-protobuf-stream@1.1.1" \
    "multiformats@12.0.1" \
    "uint8arraylist@2.4.3" && \
    npm install --omit-dev

COPY tsconfig.json ./tsconfig.json

COPY src/ src/

RUN npm run build 

EXPOSE 3000

CMD ["node", "./build/index.js", "--trace-deprecation"]




