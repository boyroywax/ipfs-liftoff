# Kubo NPM Installer

## About Kubo NPM
The Kubo NPM package is a JavaScript library that provides a simple way to install the Kubo IPFS daemon and its dependencies.


## What does this package do?
This package is a test suite containing a wrapper around the Kubo NPM. It provides a simple way to install and remove the Kubo IPFS daemon and its dependencies.  This package is for testing and demonstration purposes only. It is not intended for production use.


## Installation

### Install manually with NPM
You can install the Kubo IPFS daemon and its [dependencies manually](https://github.com/ipfs/npm-kubo?tab=readme-ov-file#install).  This will install the Kubo IPFS daemon into the `node_modules` directory of your project.

```bash
yarn add kubo@v0.35.0
# or
npm install kubo@v0.35.0
```

### Optional Path Override
If you want to override the default path for the Kubo binary, you can set the `KUBO_BINARY` [environment variable](https://github.com/ipfs/npm-kubo/blob/master/README.md#overriding-with-kubo_binary-env).

```bash
set KUBO_BINARY=/opt/kubo
```

### Add to package.json
You can also add the Kubo IPFS daemon to your `package.json` file. This will install the Kubo IPFS daemon and its dependencies when you run `npm install`.

```json
{
  "dependencies": {
    "kubo": "^0.35.0"
  }
}
```


## Usage

1. Clone the repository

```sh
git clone boyroywax/ipfs-liftoff
cd ipfs-liftoff/peers/kubo/npm-kubo/v0.35.0
```

2. Install the dependencies.  This will install the development dependencies but not the Kubo IPFS daemon. 

```sh
yarn install
# or
npm install
```

3. Run the Unit Tests

### In your local environment

```sh
yarn test
# or
npm test
```

### In Docker

Launch the docker-compose file to run the tests in an Alpine container.
```sh
docker-compose -f ./tests/docker/docker-compose.yaml up -d --build && \
docker logs -f --tail 1000 ipfs-liftoff-npm-kubo-tests-v0.35.0
```

## Features
| Feature | Description | Status |
| ------- | ----------- | ------ |
| Installation | Installs the Kubo IPFS daemon and its dependencies. | ✅ |
| Removal | Removes the Kubo IPFS daemon and its dependencies. | ✅ |


## References

[1] Kubo NPM Github - [https://github.com/ipfs/npm-kubo](https://github.com/ipfs/npm-kubo)

[2] Kubo Distribution - [https://dist.ipfs.tech/#kubo](https://dist.ipfs.tech/#kubo)

[3] Kubo RPC Client Javascript - [https://www.npmjs.com/package/kubo-rpc-client](https://www.npmjs.com/package/kubo-rpc-client)
