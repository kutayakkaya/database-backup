import { DatabaseType, DatabaseConfig } from "./types";
import { IDatabaseBackup } from "./IDatabaseBackup";
import { MySQLBackup } from "../drivers/MySQLBackup";

export abstract class DatabaseBackupFactory {
    static create(type: DatabaseType, config: DatabaseConfig, backupFolder: string, intervalMs: number): IDatabaseBackup {
        switch (type) {
            case "mysql":
                return new MySQLBackup(config, backupFolder, intervalMs);
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
}
