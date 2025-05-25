import { KuboRPCClient } from "kubo-rpc-client";
import { KuboStatus } from "./status.js";
declare const makeCall: <T = any>(method: (() => Promise<T>) | (() => T) | Function, throwOnError?: boolean) => Promise<T | undefined>;
declare class KuboIpfsClient {
    client: KuboRPCClient | undefined;
    status: KuboStatus;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
}
export { makeCall, KuboIpfsClient };
//# sourceMappingURL=client.d.ts.map