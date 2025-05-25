import { KuboIpfsClient } from "../client.js";
declare class KuboSwarmKey {
    private client;
    constructor({ kuboIpfsClient }: {
        kuboIpfsClient: KuboIpfsClient;
    });
    getSwarmKey(): Promise<string | undefined>;
}
export { KuboSwarmKey };
//# sourceMappingURL=swarm_key.d.ts.map