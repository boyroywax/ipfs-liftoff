import { KuboSwarmKey } from "../../src/bootstrap";
import { KuboIpfsClient } from "../../src/client";

async function bootstrapTest() {
    const kubo = new KuboIpfsClient();
    await kubo.start();

    console.log("Kubo IPFS client started successfully.");

    const bootstrap = new KuboSwarmKey({
        kuboIpfsClient: kubo
    })

    const swarmKey = await bootstrap.getSwarmKey();

    if (swarmKey) {
        console.log("Swarm Key retrieved successfully:", swarmKey);
    } else {
        console.error("Failed to retrieve Swarm Key.");
    }

    await kubo.stop();
    console.log("Kubo IPFS client stopped successfully.");
}

export {
    bootstrapTest
}