FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

RUN apt update && \ 
    apt install -y git

COPY package*.json ./

RUN npm install -g npm@10.3.0 \
    typescript \
    es-main



#
# BEGIN WORKAROUND: DAMAGED PACKAGE.JSON IN VERSION 8.0.1
#
WORKDIR /usr/app/webapp/src
RUN git clone https://github.com/libp2p/js-libp2p-daemon.git

WORKDIR /usr/app/webapp/src/js-libp2p-daemon/packages/libp2p-daemon-client
RUN git checkout 36203a9
RUN rm package.json
COPY ./js-libp2p-daemon-client-package.json ./package.json

# WORKDIR /usr/app/webapp/src
# RUN mkdir -p ./node_modules/@libp2p/daemon-client
# RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-client/* ./node_modules/@libp2p/daemon-client
# RUN mkdir -p ./node_modules/@libp2p/daemon-protocol
# RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-protocol/* ./node_modules/@libp2p/daemon-protocol
# RUN mkdir -p ./node_modules/@libp2p/daemon-server
# RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-server/* ./node_modules/@libp2p/daemon-server
# RUN mkdir -p ./node_modules/@libp2p/daemon
# RUN mv ./js-libp2p-daemon/packages/libp2p-daemon/* ./node_modules/@libp2p/daemon

WORKDIR /usr/app/webapp/src
RUN mkdir -p /usr/app/webapp/src/daemon-client
RUN mv -f ./js-libp2p-daemon/packages/libp2p-daemon-client/* /usr/app/webapp/src/daemon-client

WORKDIR /usr/app/webapp/src/daemon-client
RUN npm install --omit-dev && \
    npm link

WORKDIR /usr/app/webapp/

RUN npm link @libp2p/daemon-client

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

# WORKDIR /usr/app/webapp/node_modules/@libp2p/daemon-protocol
# RUN npm install

# WORKDIR /usr/app/webapp/node_modules/@libp2p/daemon-server
# RUN npm install
#
# END WORKAROUND
#



COPY src/ src/

# RUN cd ./src && npm link @libp2p/daemon-client

RUN npm run build 

EXPOSE 3000

CMD ["node", "./build/index.js", "--trace-deprecation"]




