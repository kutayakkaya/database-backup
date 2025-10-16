import { appendFileSync } from "fs";
import path from "path";
import { getTimestamp } from "./getTimestamp";

const LOG_FILE = path.join(process.cwd(), "logs.txt");

export class Logger {
    private static formatMessage(level: string, message: string) {
        return `[${getTimestamp()}] <${level}> ${message}`;
    }

    private static writeToFile(formattedMessage: string) {
        appendFileSync(LOG_FILE, formattedMessage + "\n", { encoding: "utf-8" });
    }

    static info(message: string) {
        const formatted = this.formatMessage("INFO", message);

        console.log(`\x1b[32m${formatted}\x1b[0m`);
        this.writeToFile(formatted);
    }

    static warn(message: string) {
        const formatted = this.formatMessage("WARN", message);

        console.log(`\x1b[33m${formatted}\x1b[0m`);
        this.writeToFile(formatted);
    }

    static error(message: string, shouldThrowError = false) {
        const formatted = this.formatMessage("ERROR", message);

        console.error(`\x1b[31m${formatted}\x1b[0m`);
        this.writeToFile(formatted);

        if (shouldThrowError) {
            throw new Error(message);
        }
    }
}