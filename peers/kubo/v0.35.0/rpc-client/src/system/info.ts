import { KuboRPCClient } from "kubo-rpc-client";

const checkClientVersion = async ({
    client
}:{
    client: KuboRPCClient
}): Promise<string | undefined> => {
    try {
        const version = await client.version();
        console.log("Kubo IPFS version:", version);
        return version.version;
    } catch (error) {
        console.error("Error retrieving Kubo IPFS version:", error);
        return undefined;
    }
}

const checkClientOnlineStatus = async ({
    client
}:{
    client: KuboRPCClient
}): Promise<boolean> => {
    try {
        const isOnline = await client.isOnline();
        console.log("Kubo IPFS client is online:", isOnline);
        return isOnline;
    } catch (error) {
        console.error("Error checking Kubo IPFS online status:", error);
        return false;
    }
}

