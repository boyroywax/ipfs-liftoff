FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

RUN apt update && \ 
    apt install -y git

COPY package*.json ./

RUN npm install -g npm@10.3.0 \
    typescript \
    es-main

RUN npm install

COPY tsconfig.json ./tsconfig.json

#
# BEGIN WORKAROUND: DAMAGED PACKAGE.JSON IN VERSION 8.0.1
#
WORKDIR /usr/app/webapp/
RUN git clone https://github.com/libp2p/js-libp2p-daemon.git

WORKDIR /usr/app/webapp/js-libp2p-daemon/packages/libp2p-daemon-client
RUN git checkout 36203a9
RUN rm package.json
COPY ./js-libp2p-daemon-client-package.json ./package.json

WORKDIR /usr/app/webapp/
RUN mkdir -p ./node_modules/@libp2p/daemon-client
RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-client/* ./node_modules/@libp2p/daemon-client
RUN mkdir -p ./node_modules/@libp2p/daemon-protocol
RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-protocol/* ./node_modules/@libp2p/daemon-protocol
RUN mkdir -p ./node_modules/@libp2p/daemon-server
RUN mv ./js-libp2p-daemon/packages/libp2p-daemon-server/* ./node_modules/@libp2p/daemon-server
RUN mkdir -p ./node_modules/@libp2p/daemon
RUN mv ./js-libp2p-daemon/packages/libp2p-daemon/* ./node_modules/@libp2p/daemon



WORKDIR /usr/app/webapp/node_modules/@libp2p/daemon-client
RUN npm install

WORKDIR /usr/app/webapp/node_modules/@libp2p/daemon-protocol
RUN npm install

WORKDIR /usr/app/webapp/node_modules/@libp2p/daemon-server
RUN npm install
#
# END WORKAROUND
#

WORKDIR /usr/app/webapp/

COPY src/ src/

# RUN cd ./src && npm link @libp2p/daemon-client

RUN npm run build

EXPOSE 3000

CMD ["node", "./build/index.js", "--trace-deprecation"]




