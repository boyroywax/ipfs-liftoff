import { KuboIpfsBinManager } from '../../src';

describe('KuboIpfsManager', () => {
    let manager: KuboIpfsBinManager;
    
    beforeAll( async () => {
        manager = new KuboIpfsBinManager()
    })

    afterAll(async() => {
        // Clean up any resources or state if needed
        await manager.uninstall()
    });

    it('should check for Kubo IPFS', async () => {
        try {
            const isKuboInstalled = await manager.checkForKubo()
        }
        catch (error: any) {
            expect(error.message).toEqual('Kubo IPFS is not installed.')
        }
    });
    
    it('should install Kubo', async () => {
        const path = await manager.install()
        console.log(path)
        expect(path).toBeDefined()
    });

    it('should check for IPFS version', async () => {
        try {
            const version = await manager.checkForIPFSVersion()
            expect(version).toBeDefined()
        } catch (error: any) {
            expect(error.message).toEqual('Kubo IPFS is not installed.')
        }
    });

    it('should uninstall Kubo', async () => {
        await manager.uninstall()
        // expect(manager.kubo.path()).toBeUndefined()
        try {
            await manager.checkForIPFSVersion();
        } catch (error: any) {
            expect(error.message).toEqual('Kubo IPFS is not installed.');
        }
    });

});