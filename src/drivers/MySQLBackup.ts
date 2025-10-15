import { IDatabaseBackup } from "../core/IDatabaseBackup";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class MySQLBackup extends IDatabaseBackup {
    async backup(): Promise<void> {
        const { hostname, user, password, database } = this.config;
        const outputPath = this.getOutputPath("sql");
        const cmd = `mysqldump --no-defaults -h ${hostname} -u ${user} -p"${password}" ${database} > "${outputPath}"`;

        try {
            await execAsync(cmd);
            console.log(`MySQL backup created at: ${outputPath}`);
        } catch (err) {
            if (err instanceof Error) {
                let errorMessage = err.message;

                errorMessage = errorMessage.replace(/-p"([^"]*)"/g, '-p"***"');
                throw new Error(`MySQL backup failed: ${errorMessage}`);
            }
        }
    }
}
