import path from "path";
import { mkdirSync, existsSync } from "fs";
import { DatabaseConfig } from "./types";
import { getTimestamp } from "../utils/getTimestamp";
import { Logger } from "../utils/Logger";

export abstract class IDatabaseBackup {
    protected readonly config: DatabaseConfig;
    protected readonly backupFolder: string;
    protected readonly intervalMs: number;
    private intervalId?: NodeJS.Timeout;

    constructor(config: DatabaseConfig, backupFolder: string, intervalMs: number) {
        if (!config || !config.hostname || !config.user || !config.database || !config.password) {
            Logger.error("Invalid configuration: missing required parameters.", true);
        }

        if (!backupFolder) {
            Logger.error("Backup folder path cannot be empty.", true);
        }

        if (intervalMs <= 0) {
            Logger.error("Interval must be greater than zero.", true);
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
                    Logger.error(`Backup error for ${this.config.database}: ${err.message}`);
                } else {
                    Logger.error(`Unknown backup error: ${err}`);
                }
            }
        }, this.intervalMs);

        Logger.warn(`Backup interval started for ${this.config.database} (${this.intervalMs}ms).`);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            Logger.warn(`Backup interval stopped for ${this.config.database}.`);
            this.intervalId = undefined;
        }
    }

    protected getOutputPath(extension?: string): string {
        if (!existsSync(this.backupFolder)) {
            mkdirSync(this.backupFolder, { recursive: true });
        }

        const { database } = this.config;
        const timestamp = getTimestamp();
        const fileName = extension ? `${database}_${timestamp}.${extension}` : `${database}_${timestamp}`;

        return path.join(this.backupFolder, fileName);
    }
}
