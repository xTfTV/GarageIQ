# GarageIQ Database Integration Testing

## Purpose

Verify that GarageIQ's SQLite database initialization, migrations, repositories, transactions, persistence, and Electron IPC handlers function correctly.

## Test Environment

- Test framework: Vitest
- Database: SQLite through better-sqlite3
- Database isolation: In-memory databases and temporary files
- Application environment: Electron and Node.js

## Running Automated Tests

From the `app` directory:

```bash
npm test
```

To run tests continuously during development:

```bash
npm run test:watch
```

To run one test file:

```bash
npx vitest run tests/database/initialization.test.ts
```

## Automated Test Coverage

### Database Initialization

- Creates required application tables and indexes.
- Inserts default ServiceTypes.
- Registers schema version 1.
- Skips previously applied migrations.
- Recognizes existing version 0 databases.
- Rejects unsupported newer schema versions.
- Rolls back failed initialization.

### Database Repositories

- Retrieves active service types.
- Retrieves vehicles by user.
- Returns empty results when appropriate.
- Filters logically cancelled records.
- Rejects invalid identifiers.

### Database Constraints

- Enables foreign key enforcement.
- Rejects invalid foreign key references.
- Verifies database integrity.

### Transactions

- Commits successful operations.
- Rolls back failed operations.

### Persistence

- Saves records to disk.
- Preserves records after closing and reopening.

### Electron IPC

- Registers approved IPC handlers.
- Returns expected database responses.
- Validates request parameters.
- Rejects unauthorized senders.
- Returns generic database errors.

## Manual Electron Verification

Start GarageIQ:

```bash
npm run dev
```

Open Developer Tools and verify:

```javascript
await window.garageIQ.database.checkHealth()
await window.garageIQ.serviceTypes.getAllActive()
await window.garageIQ.serviceTypes.getById(1)
```

Verify that the application still works after completely restarting Electron.

Confirm that direct SQLite access, Node integration, and unrestricted IPC methods are not exposed to the React renderer.

## Safety

- Never run destructive tests against `Database/garageiq.db`.
- Do not commit `.db` test files.
- Use isolated databases for integration testing.
- Do not use production user credentials in test fixtures.
- Keep manually created test data separate from real user data.
