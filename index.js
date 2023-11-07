const BackupService = require("./service/DatabaseBackup");
const databaseBackup = new BackupService();

databaseBackup.startBackup();