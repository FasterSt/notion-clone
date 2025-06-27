import * as SQLite from 'expo-sqlite';

// Singleton para gestionar una única instancia de la base de datos
export class DatabaseManager {
  private static instance: DatabaseManager;
  private database: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async getDbInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!this.database) {
      try {
        this.database = await SQLite.openDatabaseAsync('mydb');
      } catch (error) {
        console.error('Error al abrir la base de datos:', error);
        throw error;
      }
    }
    return this.database;
  }

  // Cerrar la base de datos
  public async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.closeAsync();
      this.database = null;
    }
  }
}
