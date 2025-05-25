import { KuboIpfsClient } from "../client";

class KuboSwarmKey {
    private client: KuboIpfsClient;

    constructor({
        kuboIpfsClient
    }:{
        kuboIpfsClient: KuboIpfsClient;
    }) {
        this.client = kuboIpfsClient;
    }

    async getSwarmKey(): Promise<string | undefined> {
        try {
            const swarmKey = await this.client.client?.config.get("Swarm.Key");
            console.log("Swarm Key retrieved:", swarmKey);
        } catch (error) {
            console.error("Error retrieving swarm key:", error);
            return undefined;
        }
    }
}
export { KuboSwarmKey };