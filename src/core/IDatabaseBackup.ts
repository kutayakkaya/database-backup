import { DatabaseConfig } from "./types";
import { mkdirSync, existsSync } from "fs";
import path from "path";

export abstract class IDatabaseBackup {
    protected readonly config: DatabaseConfig;
    protected readonly backupFolder: string;
    protected readonly intervalMs: number;
    private intervalId?: NodeJS.Timeout;

    constructor(config: DatabaseConfig, backupFolder: string, intervalMs: number) {
        if (!config || !config.hostname || !config.user || !config.database || !config.password) {
            throw new Error("Invalid configuration: missing required parameters.");
        }

        if (!backupFolder) {
            throw new Error("Backup folder path cannot be empty.");
        }

        if (intervalMs <= 0) {
            throw new Error("Interval must be greater than zero.");
        }

        this.config = config;
        this.backupFolder = backupFolder;
        this.intervalMs = intervalMs;
    }

    abstract backup(): Promise<void>;

    start(): void {
        this.stop();
        this.backup();

        this.intervalId = setInterval(async () => {
            try {
                await this.backup();
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`Backup error for ${this.config.database}: ${err.message}`);
                }
            }
        }, this.intervalMs);

        console.log(`Backup interval started for ${this.config.database} (${this.intervalMs}ms).`);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log(`Backup interval stopped for ${this.config.database}.`);
            this.intervalId = undefined;
        }
    }

    protected getTimestamp(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        return `backup_${day}-${month}-${year}_${hour}-${minute}`;
    }

    protected getOutputPath(extension?: string): string {
        if (!existsSync(this.backupFolder)) {
            mkdirSync(this.backupFolder, { recursive: true });
        }

        const { database } = this.config;
        const timestamp = this.getTimestamp();
        const fileName = extension ? `${database}_${timestamp}.${extension}` : `${database}_${timestamp}`;

        return path.join(this.backupFolder, fileName);
    }
}
