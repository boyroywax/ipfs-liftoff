###########
#  BASE   #
###########

FROM node:21-alpine3.18 as base

WORKDIR /home/app

COPY package*.json ./
COPY tsconfig.json ./

RUN yarn install

RUN yarn add global typescript --dev

COPY src/ src/

RUN yarn build

#################
#  TS-REMOVER   #
#################

FROM node:21-alpine3.18 as ts-remover

WORKDIR /usr/app

COPY --from=base /home/app/package*.json ./

RUN yarn install --only=production

COPY --from=base /home/app/dist ./

###########
#  FINAL  #
###########

FROM node:21-alpine3.18

WORKDIR /usr/app

COPY --from=ts-remover /usr/app ./
# COPY .env ./
# COPY ./static ./

USER 1000

CMD ["node", "--trace-deprecation", "index.js"]