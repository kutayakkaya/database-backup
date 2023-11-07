const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const formatTimestamp = require('../util/formatTimestamp');

require('dotenv').config();

class DatabaseBackup {
    constructor() {
        this.mysqlConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        };
        this.backupCommand = `mysqldump --no-defaults -h ${this.mysqlConfig.host} -u ${this.mysqlConfig.user} -p"${this.mysqlConfig.password}" ${this.mysqlConfig.database}`;
        this.backupFolder = path.join(process.cwd(), 'backups'); // Backup folder path
    }

    backupDatabase() {
        exec(this.backupCommand, (error, stdout) => {
            if (error) {
                console.log('Backup error:', error);
                return;
            }

            const timestamp = formatTimestamp(new Date());
            const backupFileName = `${timestamp}.sql`;
            const backupFilePath = path.join(this.backupFolder, backupFileName); // Backup file path

            fs.mkdirSync(this.backupFolder, { recursive: true }); // Create the "backups" folder if it does not exist

            fs.writeFile(backupFilePath, stdout, (error) => {
                if (error) {
                    console.error(`File creation error: ${error.message}`);
                } else {
                    console.log(`Backup completed: ${backupFilePath}`);
                }
            });
        });
    }

    startBackup() {
        this.backupDatabase();
        console.log('Backup process initiated. Will repeat every hour.');
        setInterval(() => {
            this.backupDatabase();
        }, 60 * 60 * 1000);
    }
}

module.exports = DatabaseBackup;