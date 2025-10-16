import { DatabaseBackupFactory } from "./core/DatabaseBackupFactory";
import { DatabaseConfig, DatabaseType } from "./core/types";

const config: DatabaseConfig = {
    hostname: "your_hostname",
    user: "your_username",
    database: "your_database",
    password: "your_password"
};
const dbType: DatabaseType = "mysql";
const backupFolder = "your_backup_folder";
const intervalMs = 1000 * 60 * 60;
const mysqlBackup = DatabaseBackupFactory.create(dbType, config, backupFolder, intervalMs);

try {
    mysqlBackup.start();
} catch (err) {
    if (err instanceof Error) {
        console.error("Error:", err.message);
    } else {
        console.error("Unknown error:", err);
    }
}
