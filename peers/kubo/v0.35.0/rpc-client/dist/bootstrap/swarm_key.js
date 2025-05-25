class KuboSwarmKey {
    client;
    constructor({ kuboIpfsClient }) {
        this.client = kuboIpfsClient;
    }
    async getSwarmKey() {
        try {
            const swarmKey = await this.client.client?.config.get("Swarm.Key");
            console.log("Swarm Key retrieved:", swarmKey);
        }
        catch (error) {
            console.error("Error retrieving swarm key:", error);
            return undefined;
        }
    }
}
export { KuboSwarmKey };
//# sourceMappingURL=swarm_key.js.map