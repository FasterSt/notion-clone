import { DatabaseManager } from '@/database/base';

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

    // Crear un usuario por defecto
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Verificar si ya hay un usuario por defecto
    const userResult = await db.getAllAsync('SELECT COUNT(*) as count FROM users WHERE id = 1');
    const userCount = userResult[0].count;
    if (userCount === 0) {
      // Insertar un usuario por defecto solo si no existe
      await db.execAsync(`
        INSERT INTO users (name, email) VALUES ('User 1', 'default@email.com');
      `);
    }

    // Mostrar las tablas creadas y los usuarios
    const tables = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log("Tablas en la base de datos:", tables.map(row => row));
    const users = await db.getAllAsync('SELECT * FROM users');
    console.log("Usuarios en la base de datos:", users);
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