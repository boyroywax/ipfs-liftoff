import os from "os";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { KuboStatus } from "./statuses";

// /**
//  * Default Kubo version to be used if not specified.
//  * @constant
//  * @type {string}
//  * @default
//  */
// const DEFAULT_KUBO_VERSION: string = process.env.KUBO_VERSION || "0.35.0";

function log(status: string, message: string) {
    const now = new Date().toISOString();
    console.log(`[${now}] [${status}] ${message}`);
}

function logError(status: string, message: string, error?: any) {
    const now = new Date().toISOString();
    if (error) {
        console.error(`[${now}] [${status}] ${message}`, error);
    } else {
        console.error(`[${now}] [${status}] ${message}`);
    }
}

/**
 * KuboIpfsBinManager is a class that manages the installation and uninstallation of Kubo IPFS.
 *
 * Manages the lifecycle and installation of a Kubo IPFS Binary node within a Node.js environment.
 *
 * This class provides methods to install, uninstall, start, and stop a Kubo IPFS instance,
 * as well as to check for its presence and version. It also manages the integration of Kubo
 * into the project's `package.json` dependencies.
 *
 * @remarks
 * - The manager supports Linux, macOS, and Windows platforms.
 * - Installation and uninstallation are performed using Yarn.
 * - The path to the Kubo binary can be overridden via the `KUBO_BINARY` environment variable.
 *
 * @example
 * ```typescript
 * const manager = new KuboIpfsBinManager();
 * await manager.install();
 * await manager.uninstall();
 * ```
 *
 * @public
 */
class KuboIpfsBinManager {
    public static DEFAULT_KUBO_VERSION: string = process.env.KUBO_VERSION || "0.35.0";
    public kubo: any;
    public path: string;
    public status: KuboStatus = KuboStatus.NotInstalled;

    constructor() {
        const envPath = this.getPathFromEnv();
        console.log("Kubo IPFS path from env:", envPath);
        this.path = envPath !== undefined ? envPath as string : "../node_modules/.bin/ipfs";
    }

    public getPathFromEnv(): string | undefined {
        return process.env.KUBO_BINARY;
    }

    public async checkForKubo(): Promise<boolean> {
        if (!fs.existsSync(this.path)) {
            this.status = KuboStatus.NotInstalled;
            throw new Error("Kubo IPFS is not installed.");
        }

        const execPromise = promisify(exec);
        return execPromise("kubo version")
            .then(() => {
                this.status = KuboStatus.Installed;
                log("INFO", "Kubo IPFS is installed.");
                return true;
            })
            .catch(() => {
                this.status = KuboStatus.NotInstalled;
                log("WARN", "Kubo IPFS is not installed.");
                return false;
            });
    }

    public async checkForIPFSVersion() {
        if (!fs.existsSync(this.path)) {
            this.status = KuboStatus.NotInstalled;
            throw new Error("Kubo IPFS is not installed.");
        }
        const execPromise = promisify(exec);

        return execPromise("ipfs version")
            .then((result) => {
                console.log(result);
                const version = result.stdout.split(" ")[1];
                this.status = KuboStatus.Installed;
                log("INFO", `Kubo IPFS version: ${version}`);
                return version;
            })
            .catch(() => {
                this.status = KuboStatus.Error;
                logError("ERROR", "Error checking Kubo IPFS version.");
                throw new Error("Error checking Kubo IPFS version.");
            });
    }

    public async checkPackageJsonForKubo(): Promise<boolean> {
        if (!fs.existsSync("package.json")) {
            this.status = KuboStatus.Error;
            logError("ERROR", "package.json not found.");
            throw new Error("package.json not found.");
        }
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        if (!packageJson.dependencies || !packageJson.dependencies.kubo) {
            return false;
        }
        return true;
    }

    public async addKuboToPackageJson() {
        if (!fs.existsSync("package.json")) {
            this.status = KuboStatus.Error;
            logError("ERROR", "package.json not found.");
            throw new Error("package.json not found.");
        }
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }
        if (!packageJson.dependencies.kubo) {
            packageJson.dependencies.kubo = KuboIpfsBinManager.DEFAULT_KUBO_VERSION;
        }
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
        log("INFO", "Kubo IPFS added to package.json.");
    }

    public async removeKuboFromPackageJson() {
        if (!fs.existsSync("package.json")) {
            this.status = KuboStatus.Error;
            logError("ERROR", "package.json not found.");
            throw new Error("package.json not found.");
        }
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        if (packageJson.dependencies && packageJson.dependencies.kubo) {
            delete packageJson.dependencies.kubo;
        }
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
        log("INFO", "Kubo IPFS removed from package.json.");
    }

    public async install(): Promise<string | undefined> {
        if (this.status === KuboStatus.Installed) {
            log("INFO", "Kubo IPFS is already installed.");
            return;
        }
        if (this.status === KuboStatus.Installing) {
            log("INFO", "Kubo IPFS is already installing.");
            return;
        }

        if (this.status === KuboStatus.Uninstalling) {
            log("INFO", "Kubo IPFS is currently uninstalling.");
            return;
        }
        if (this.status === KuboStatus.Error) {
            log("ERROR", "Kubo IPFS is in an error state.");
            return;
        }

        this.status = KuboStatus.Installing;
        const supportedOS = ["linux", "darwin", "win32"];
        const currentOS = os.platform();
        console.log("Current OS:", currentOS);

        if (!supportedOS.includes(currentOS)) {
            this.status = KuboStatus.Error;
            const message = `Unsupported OS: ${currentOS}`;
            logError("ERROR", message);
            throw new Error(`[${new Date().toISOString()}] [ERROR] ${message}`);
        }

        if (fs.existsSync(this.path)) {
            this.status = KuboStatus.Installed;
            log("INFO", "Kubo IPFS is already installed.");
            return;
        }

        log("INFO", "Installing Kubo IPFS...");

        if(await this.checkPackageJsonForKubo() === false) {
            await this.addKuboToPackageJson();
        }

        const execPromise = promisify(exec);

        try {
            await execPromise("yarn add kubo");
            log("INFO", "Kubo IPFS installed successfully.");

            await execPromise("yarn install");
            // @ts-ignore
            this.kubo = await import("kubo");
            log("INFO", "Kubo IPFS imported successfully from " + this.kubo.path());
            this.status = KuboStatus.Installed;
        } catch (error) {
            this.status = KuboStatus.Error;
            logError("ERROR", "Error installing Kubo IPFS:", error);
        }


        if (this.status === KuboStatus.Installed) {
            log("INFO", "Kubo IPFS is installed and ready to use.");
        } else {
            log("ERROR", "Kubo IPFS installation failed.");
        }

        return this.kubo.path();
    }

    public async uninstall() {
        this.status = KuboStatus.Uninstalling;
        log("INFO", "Uninstalling Kubo IPFS...");
        const execPromise = promisify(exec);
        try {
            await execPromise("yarn remove kubo");
            this.status = KuboStatus.NotInstalled;
            log("INFO", "Kubo IPFS uninstalled successfully.");

            if (await this.checkPackageJsonForKubo() === true) {
                await this.removeKuboFromPackageJson();
            }
        } catch (error) {
            this.status = KuboStatus.Error;
            logError("ERROR", "Error uninstalling Kubo IPFS:", error);
        }
    }
}

export {
    KuboIpfsBinManager
}
