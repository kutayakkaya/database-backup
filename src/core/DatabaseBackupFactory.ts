import { DatabaseType, DatabaseConfig } from "./types";
import { IDatabaseBackup } from "./IDatabaseBackup";
import { MySQLBackup } from "../drivers/MySQLBackup";
import { Logger } from "../utils/Logger";

export class DatabaseBackupFactory {
    static create(type: DatabaseType, config: DatabaseConfig, backupFolder: string, intervalMs: number): IDatabaseBackup {
        switch (type) {
            case "mysql":
                return new MySQLBackup(config, backupFolder, intervalMs);
            default:
                Logger.error(`Unsupported database type: ${type}`, true);
                return {} as IDatabaseBackup;
        }
    }
}
