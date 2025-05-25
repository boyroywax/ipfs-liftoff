import { KuboIpfsClient } from "../../src/client";

async function connectTest() {
    const kubo = new KuboIpfsClient();
    await kubo.start();

    console.log("Kubo IPFS client started successfully.");

    // Check if the client is online
    if (kubo.client) {
        const isOnline: boolean = await kubo.client.isOnline();
        console.log("Kubo IPFS client is online: " + isOnline);
    } else {
        console.error("❌ Kubo IPFS client is not initialized.");
    }
    // Check the version of the Kubo IPFS client
    if (kubo.client) {
        const version = await kubo.client.version();
        console.log("Kubo IPFS client version: " + JSON.stringify(version));
    }
    else {
        console.error("❌ Kubo IPFS client is not initialized.");
    }

    // Check the status of the Kubo IPFS client
    if (kubo.status) {
        console.log("Kubo IPFS client status: " + kubo.status);
    }
    else {
        console.error("❌ Kubo IPFS client status is not available.");
    }

    await kubo.stop();
    console.log("Kubo IPFS client stopped successfully.");
}


export {
    connectTest
}
