# Database Backup

This is a Node.js application that performs automatic backups of a MySQL database using the `mysqldump` command. The backups are saved as SQL files in a "backups" folder.

## Features

- Automatic backup of a MySQL database at regular intervals (default: every hour)
- Backup files are saved as SQL files in a designated "backups" folder
- The "backups" folder is automatically created if it does not exist
- The backup process logs information and error messages to the console

## Prerequisites

Before running the application, make sure you have the following:

- Node.js installed on your machine
- A MySQL database with connection credentials
- MySQL command-line tools installed (to use the `mysqldump` command)

## Getting Started

1. Clone this repository to your local machine or download the source code.
2. Install the dependencies by running the following command in the project directory:
`npm install`
3. Create a `.env` file in the project directory and set the following environment variables:
`DB_HOST=<MySQL host>
DB_USER=<MySQL username>
DB_PASSWORD=<MySQL password>
DB_DATABASE=<MySQL database name>`
4. Replace `<MySQL host>`, `<MySQL username>`, `<MySQL password>`, and `<MySQL database name>` with your own database connection details
5. Run the application using the following command:
`node index.js` or `npm start`
6. The backup process will start, and you will see log messages indicating the progress and status of each backup operation.

## Customization

- If you want to change the backup interval, modify the interval value in the `setInterval` function call in `startBackup` method of the `DatabaseBackup` class (specified in milliseconds).
- To specify a different backup folder path, modify the `backupFolder` property in the `DatabaseBackup` class constructor.

## License

This project is licensed under the [MIT License](LICENSE).
