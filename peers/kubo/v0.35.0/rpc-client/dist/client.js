import { create } from "kubo-rpc-client";
const makeCall = async (method, throwOnError = true) => {
    try {
        const result = await method();
        return result;
    }
    catch (error) {
        if (throwOnError) {
            throw error;
        }
        console.error("Error during RPC call:", error.message || error);
    }
};
class KuboIpfsClient {
    client;
    status = 'Initializing';
    constructor() {
        // Use the environment variable or default to localhost
        const apiUrl = process.env.IPFS_API_URL || "http://127.0.0.1:5001";
        console.log("Kubo IPFS client API URL: " + apiUrl);
        // Extract parameters from the URL
        const { hostname, port, protocol } = new URL(apiUrl);
        this.client = create({
            host: hostname,
            port: port,
            protocol: protocol.replace(":", ""),
            apiPath: 'api/v0'
        });
        console.log("Kubo IPFS client for " + JSON.stringify(makeCall(this.client.getEndpointConfig)));
    }
    async start() {
        this.status = 'Starting';
        if (this.client) {
            const isOnline = await makeCall(async () => await this.client?.isOnline());
            console.log("Kubo IPFS client is online: " + isOnline);
            if (isOnline) {
                this.status = 'Online';
                const version = await makeCall(this.client.version);
                console.log("Kubo IPFS client version: " + JSON.stringify(version));
            }
            else {
                this.status = 'Offline';
                console.error("Kubo IPFS client is offline.");
            }
        }
        else {
            this.status = 'Error';
            console.error("Kubo IPFS client is not initialized.");
        }
    }
    async stop() {
        this.status = 'Stopping';
        if (this.client) {
            await makeCall(this.client.stop);
            this.status = 'Offline';
            console.log("Kubo IPFS client stopped.");
        }
        else {
            this.status = 'Error';
            console.error("Kubo IPFS client is not initialized.");
        }
    }
}
export { makeCall, KuboIpfsClient };
//# sourceMappingURL=client.js.map