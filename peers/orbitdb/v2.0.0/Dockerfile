FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

COPY package*.json ./

RUN npm install -g \ 
    npm@10.3.0 \
    babel-cli \
    webpack

RUN npm install && \
    npm install \
    execa \
    signal-exit

COPY tsconfig.json ./tsconfig.json

COPY src/ src/

RUN npm run build

COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 3000 5001 5002

CMD ["node", "./build/index.js", "--trace-deprecation"]




