import { DatabaseManager } from './base';

// Función para inicializar el esquema de la base de datos
export const initializeDatabase = async (): Promise<void> => {
  try {
    const dbManager = DatabaseManager.getInstance();
    const db = await dbManager.getDbInstance();
    
    // Crear tablas y datos iniciales solo como test
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        name TEXT,
        age INTEGER
      );
    `);
    
    // Verificar si ya hay datos para evitar duplicados
    const result = await db.getAllAsync('SELECT COUNT(*) as count FROM test');
    const count = result[0].count;
    
    if (count === 0) {
      // Insertar datos solo si la tabla está vacía
      await db.execAsync(`
        INSERT INTO test (name, age) VALUES ('John Doe', 30);
        INSERT INTO test (name, age) VALUES ('Jane Doe', 25);
      `);
      console.log('Datos iniciales insertados con éxito');
    } else {
      console.log('Los datos ya existen, no se insertaron duplicados');
    }
    console.log("PATH: ", db.databasePath);
    console.log('Base de datos inicializada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

// Funciones de utilidad para operaciones CRUD
export const getUsers = async (): Promise<any[]> => {
  try {
    const dbManager = DatabaseManager.getInstance();
    const db = await dbManager.getDbInstance();
    const result = await db.getAllAsync('SELECT * FROM test');
    return result;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const insertUser = async (name: string, age: number): Promise<void> => {
  try {
    const dbManager = DatabaseManager.getInstance();
    const db = await dbManager.getDbInstance();
    await db.runAsync('INSERT INTO test (name, age) VALUES (?, ?)', [name, age]);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  }
};

// Exportamos la instancia del gestor de base de datos
export const getDbManager = (): DatabaseManager => {
  return DatabaseManager.getInstance();
};