import { create, EndpointConfig, KuboRPCClient, VersionResult } from "kubo-rpc-client";
import { KuboStatus } from "./status";


const makeCall = async <T = any>(
    method: (() => Promise<T>) | (() => T) | Function,
    throwOnError: boolean = true

): Promise<T | undefined> => {
    try {
        const result = await method();
        return result;
    } catch (error: any) {
    if (throwOnError) {
            throw error;
        }

    console.error("Error during RPC call:", error.message || error);
    }
}


class KuboIpfsClient {
    public client: KuboRPCClient | undefined;
    public status: KuboStatus = 'Initializing';

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

        console.log("Kubo IPFS client for " + JSON.stringify(makeCall<EndpointConfig>(this.client.getEndpointConfig)));
    }

    async start() {
        this.status = 'Starting';
        if (this.client) {
            const isOnline: boolean | undefined = await makeCall<boolean | undefined>(async () => await this.client?.isOnline());
            console.log("Kubo IPFS client is online: " + isOnline);
            if (isOnline) {
                this.status = 'Online';
                const version = await makeCall<VersionResult>(this.client.version);
                console.log("Kubo IPFS client version: " + JSON.stringify(version));
            } else {
                this.status = 'Offline';
                console.error("Kubo IPFS client is offline.");
            }
        } else {
            this.status = 'Error';
            console.error("Kubo IPFS client is not initialized.");
        }
    }

    async stop() {
        this.status = 'Stopping';
        if (this.client) {
            await makeCall<void>(this.client.stop);
            this.status = 'Offline';
            console.log("Kubo IPFS client stopped.");
        } else {
            this.status = 'Error';
            console.error("Kubo IPFS client is not initialized.");
        }
    }
}

export {
    makeCall,
    KuboIpfsClient
}

