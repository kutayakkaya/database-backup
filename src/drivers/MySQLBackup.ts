import { exec } from "child_process";
import { promisify } from "util";
import { IDatabaseBackup } from "../core/IDatabaseBackup";
import { Logger } from "../utils/Logger";

const execAsync = promisify(exec);

export class MySQLBackup extends IDatabaseBackup {
    async backup(): Promise<void> {
        const { hostname, user, password, database } = this.config;
        const outputPath = this.getOutputPath("sql");
        const cmd = `mysqldump --no-defaults -h ${hostname} -u ${user} -p"${password}" ${database} > "${outputPath}"`;

        try {
            await execAsync(cmd);
            Logger.info(`MySQL backup created at: ${outputPath}`);
        } catch (err) {
            if (err instanceof Error) {
                let errorMessage = err.message;

                errorMessage = errorMessage.replace(/-p"([^"]*)"/g, '-p"***"');
                Logger.error(`MySQL backup failed: ${errorMessage}`);
            } else {
                Logger.error(`Unknown MySQL backup error: ${err}`);
            }
        }
    }
}
