# Database Backup System

A robust, automated database backup system built with Node.js and TypeScript. Currently supports MySQL with extensible architecture for other databases.

## Features

- **Automated Backups** - Scheduled backups at configurable intervals
- **MySQL Support** - Full MySQL database backup functionality
- **TypeScript** - Fully typed for better development experience
- **Extensible Architecture** - Easy to add new database drivers
- **File Management** - Organized backup files with timestamps

## Installation

1. **Clone the repository**
```bash
git clone <https://github.com/kutayakkaya/database-backup.git>
cd database-backup
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

## Prerequisites

- **Node.js**
- **TypeScript** (included in devDependencies)
- **MySQL** with `mysqldump` utility

## Usage

You can check the example in `src/index.ts` to see how to configure and start the backup process. Simply edit the database configuration, backup folder, and interval as needed.

```typescript
const config: DatabaseConfig = {
    hostname: "localhost",
    user: "your_username",
    database: "your_database",
    password: "your_password"
};
const dbType: DatabaseType = "mysql";
const backupFolder = "backups";
const intervalMs = 60 * 1000;
```

## Running

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm run start
```

## Architecture

### Core Components

1. **IDatabaseBackup** - Abstract base class providing:
   - Configuration validation
   - Interval management (start/stop)
   - Timestamp generation
   - File path management
   - Common error handling

2. **DatabaseBackupFactory** - Factory pattern for creating backup instances
3. **MySQLBackup** - MySQL-specific implementation using `mysqldump`

### Adding New Database Support

The system is designed to be extensible. To add a new database:

1. Create new driver in `src/drivers/` extending `IDatabaseBackup`
2. Add database type to `DatabaseType` in `src/core/types.ts`
3. Update factory in `DatabaseBackupFactory.ts`

Example for PostgreSQL:
```typescript
case "postgres":
    return new PostgreSQLBackup(config, backupFolder, intervalMs);
```

## License

This project is licensed under the [MIT License](LICENSE).