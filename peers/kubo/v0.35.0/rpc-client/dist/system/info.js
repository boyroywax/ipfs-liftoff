const checkClientVersion = async ({ client }) => {
    try {
        const version = await client.version();
        console.log("Kubo IPFS version:", version);
        return version.version;
    }
    catch (error) {
        console.error("Error retrieving Kubo IPFS version:", error);
        return undefined;
    }
};
const checkClientOnlineStatus = async ({ client }) => {
    try {
        const isOnline = await client.isOnline();
        console.log("Kubo IPFS client is online:", isOnline);
        return isOnline;
    }
    catch (error) {
        console.error("Error checking Kubo IPFS online status:", error);
        return false;
    }
};
export {};
//# sourceMappingURL=info.js.map