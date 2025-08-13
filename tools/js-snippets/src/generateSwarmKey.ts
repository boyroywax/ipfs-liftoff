import { generateKey } from '@libp2p/pnet';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Utility class for managing libp2p private swarm keys
 */
class SwarmKeyManager {
    /**
     * Generate a new swarm key
     */
    static generateKey(): Uint8Array {
        const swarmKey = new Uint8Array(95);
        generateKey(swarmKey);
        return swarmKey;
    }

    /**
     * Format a swarm key in the standard format for saving to file
     */
    static formatKey(key: Uint8Array): string {
        // The key from generateKey() is already in the full formatted string
        return Buffer.from(key).toString();
    }

    /**
     * Parse a swarm key from the standard format
     */
    static parseKey(keyString: string): Uint8Array {
        const lines = keyString.trim().split('\n');
        if (
            lines.length !== 3 ||
            lines[0] !== '/key/swarm/psk/1.0.0/' ||
            lines[1] !== '/base16/'
        ) {
            throw new Error(
                'Invalid swarm key format. Expected format:\n/key/swarm/psk/1.0.0/\n/base16/\n<hex-key>'
            );
        }

        const hexKey = lines[2];
        if (!/^[0-9a-fA-F]{64}$/.test(hexKey)) {
            throw new Error(
                'Invalid hex key. Expected 64 hex characters (32 bytes)'
            );
        }

        // Create the full key as a string, then convert to Uint8Array
        const fullKeyString = keyString.trim();
        return new Uint8Array(Buffer.from(fullKeyString));
    }

    /**
     * Save a swarm key to file
     */
    static async saveKey(key: Uint8Array, filePath: string): Promise<void> {
        const keyString = this.formatKey(key);
        await fs.writeFile(filePath, keyString, 'utf8');
    }

    /**
     * Load a swarm key from file
     */
    static async loadKey(filePath: string): Promise<Uint8Array> {
        const keyString = await fs.readFile(filePath, 'utf8');
        return this.parseKey(keyString);
    }

    /**
     * Generate and save a new swarm key
     */
    static async generateAndSave(filePath: string): Promise<Uint8Array> {
        const key = this.generateKey();
        await this.saveKey(key, filePath);
        return key;
    }

    /**
     * Get the default swarm key path for a given project
     */
    static getDefaultKeyPath(projectDir: string = process.cwd()): string {
        return join(projectDir, 'swarm.key');
    }

    /**
     * Check if a swarm key file exists
     */
    static async keyExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Load or generate a swarm key
     */
    static async loadOrGenerate(
        filePath: string
    ): Promise<{ key: Uint8Array; generated: boolean }> {
        if (await this.keyExists(filePath)) {
            const key = await this.loadKey(filePath);
            return { key, generated: false };
        } else {
            const key = await this.generateAndSave(filePath);
            return { key, generated: true };
        }
    }

    /**
     * Validate a swarm key
     */
    static validateKey(key: Uint8Array): boolean {
        if (key.length !== 95) {
            return false;
        }

        // Check if it's a valid formatted key
        const keyString = Buffer.from(key).toString();
        const lines = keyString.split('\n');

        if (lines.length !== 3) {
            return false;
        }

        if (lines[0] !== '/key/swarm/psk/1.0.0/' || lines[1] !== '/base16/') {
            return false;
        }

        // Check if the hex key is valid
        const hexKey = lines[2];
        return /^[0-9a-fA-F]{64}$/.test(hexKey);
    }

    /**
     * Get key info for debugging
     */
    static getKeyInfo(key: Uint8Array): {
        valid: boolean;
        length: number;
        header: string;
        keyHex: string;
    } {
        const valid = this.validateKey(key);
        const length = key.length;
        const keyString = Buffer.from(key).toString();
        const lines = keyString.split('\n');

        let header = '';
        let keyHex = '';

        if (lines.length >= 2) {
            header = lines[0] + '\\n' + lines[1];
        }

        if (lines.length >= 3) {
            keyHex = lines[2];
        }

        return { valid, length, header, keyHex };
    }
}

export { SwarmKeyManager };
