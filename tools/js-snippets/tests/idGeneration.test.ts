import {
    generateEd25519PeerId,
    generateSecp256k1PeerId
} from '../src/generatePeerId';


describe('ID Generation', () => {
    it('should generate a valid Ed25519 peer ID', async () => {
        const { id, privateKey } = await generateEd25519PeerId();
        expect(id).toMatch(/Qm[a-zA-Z0-9]{44}/);
        expect(privateKey).toHaveProperty('type', 'Ed25519');
    });

    it('should generate a valid Secp256k1 peer ID', async () => {
        const { id, privateKey } = await generateSecp256k1PeerId();
        expect(id).toMatch(/Qm[a-zA-Z0-9]{44}/);
        expect(privateKey).toHaveProperty('type', 'secp256k1');
    });
});