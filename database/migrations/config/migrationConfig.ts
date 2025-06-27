import { DatabaseManager } from "@/database/base";
import { SQLiteDatabase } from "expo-sqlite";

export interface Migration {
    version: number;
    name: string;
    up: (db: SQLiteDatabase) => Promise<void>;
    down?: (db: SQLiteDatabase) => Promise<void>;
}

export interface MigrationDb {
    id: number;
    version: number;
    name: string;
    applied_at: string;
}

export class MigrationManager {
    private static instance: MigrationManager;
    private migrations: Migration[] = [];
    private dbManager: DatabaseManager;

    public constructor() {
        this.dbManager = DatabaseManager.getInstance();
    }

    public static getInstance(): MigrationManager {
        if (!MigrationManager.instance) {
            MigrationManager.instance = new MigrationManager();
        }
        return MigrationManager.instance;
    }

    // Register a migration
    public registerMigration(migration: Migration): void {
        this.migrations.push(migration);

        // Sort migrations by version (ascending)
        this.migrations.sort((a, b) => a.version - b.version);
    }

    // Create the migration table if it doesn't exist
    private async initMigrationTable(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                version INTEGER NOT NULL UNIQUE,
                name TEXT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    // Get the latest migration version
    private async getCurrentVersion(db: SQLiteDatabase): Promise<number> {
        try {
            const result = await db.getAllAsync<MigrationDb>("SELECT version FROM migrations ORDER BY version DESC LIMIT 1");
            return result[0].version || 0;
        } catch (error) {
            console.error("Error al obtener la versión actual de la base de datos:", error);
            return 0;
        }
    }

    // Register a migration as applied
    private async recordMigration(db: SQLiteDatabase, migration: Migration): Promise<void> {
        const now = new Date().toISOString();
        await db.runAsync(`
            INSERT INTO migrations (version, name, applied_at) VALUES (?, ?, ?)
        `, [migration.version, migration.name, now]);
    }

    // Run all migrations
    public async runMigrations(): Promise<void> {
        try {
            const db = await this.dbManager.getDbInstance();
            
            // Verify if the table exists
            await this.initMigrationTable(db);

            // Get the current version of the database
            const currentVersion = await this.getCurrentVersion(db);
            console.log("Db Current Version:", currentVersion);

            // Filter pendings migrations
            const pendingsMigrations = this.migrations.filter((m) => m.version > currentVersion);

            if (pendingsMigrations.length === 0) {
                console.log("No hay migraciones pendientes.");
                return;
            }

            console.log(`Aplicando ${pendingsMigrations.length} migraciones...`);

            await db.withTransactionAsync(async () => {
                for (const migration of pendingsMigrations) {
                    console.log(`Aplicando migración ${migration.name} (versión ${migration.version})...`);
                    await migration.up(db);
                    await this.recordMigration(db, migration);
                    console.log(`Migración v${migration.version} aplicada con éxito.`);
                }
            });

            console.log("Todas las migraciones aplicadas con éxito.");
        } catch (error) {
            console.error("Error al aplicar migraciones:", error);
            throw error;
        }
    }

    public async rollbackLastMigration(): Promise<void> {
        try {
            const db = await this.dbManager.getDbInstance();
            
            const result = await db.getFirstAsync<Migration>("SELECT * FROM migrations ORDER BY version DESC LIMIT 1");
            if (!result) {
                console.log("No hay migraciones para revertir.");
                return;
            }

            const lastMigration = this.migrations.find((m) => m.version === result.version);

            if (!lastMigration || !lastMigration.down) {
                console.log(`La migracion ${lastMigration?.name} no tiene función de rollback.`);
                return;
            }

            console.log(`Revirtiendo migración ${lastMigration.name} (versión ${lastMigration.version})...`);

            // Run Rollback in the transaction
            await db.withTransactionAsync(async () => {
                await lastMigration.down!(db);
                await db.runAsync("DELETE FROM migrations WHERE version = ?", [lastMigration.version]);
            });
            console.log(`Migración v${lastMigration.version} revertida con éxito.`);
        } catch (error) {
            console.error("Error al revertir migraciones:", error);
            throw error;
        }
    }
}