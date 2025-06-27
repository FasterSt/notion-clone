import { SQLiteDatabase } from "expo-sqlite";
import { DatabaseManager } from "../base";
import { User } from "./user";

export interface NotionFileDb {
    id: number;
    coverPhoto: string; // URL to the cover photo
    icon: string; // URL to the icon
    title: string; // Title of the file
    description: string; // Description of the file
    content: string; // Content of the file, could be text or HTML
    type: string; // Type of the file, e.g., 'document', 'spreadsheet'
    authorId: number; // ID of the author
    author: User; // Author object
    parentFileId: number | null; // ID of the parent file, if any
    panrentFile: NotionFileDb | null; // Parent file object, if any
    subFiles: NotionFileDb[]; // Array of sub-files
    file_order: number; // Order of the file in the list
    createdAt: string; // Creation date
    updatedAt: string; // Last update date
}

export type NotionFile = Omit<NotionFileDb, 'id'>;

async function initNotionFilesTable (db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notion_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            cover_photo TEXT,
            icon TEXT,
            title TEXT NOT NULL,
            description TEXT,
            content TEXT,
            type TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            parent_file_id INTEGER,
            file_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id),
            FOREIGN KEY (parent_file_id) REFERENCES notion_files(id)
        );
    `);
}

export async function createNotionFile(notionFile: NotionFile): Promise<void> {
    try {
        const dbManager = DatabaseManager.getInstance();
        const db = await dbManager.getDbInstance();
        await initNotionFilesTable(db);
        await db.runAsync(
            `INSERT INTO notion_files (cover_photo, icon, title, description, content, type, author_id, parent_file_id, file_order, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                notionFile.coverPhoto,
                notionFile.icon,
                notionFile.title,
                notionFile.description,
                notionFile.content,
                notionFile.type,
                notionFile.authorId,
                notionFile.parentFileId,
                notionFile.file_order
            ]
        );
        console.log("Notion file created successfully");
        const result = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
        console.log("Tables in the database:", result.map(row => row.name));
    } catch (error) {
        console.error('Error creating Notion file:', error);
        throw error;
    }
}

export async function getNotionFiles(): Promise<NotionFileDb[]> {
    try {
        const dbManager = DatabaseManager.getInstance();
        const db = await dbManager.getDbInstance();
        await initNotionFilesTable(db);
        const result = await db.getAllAsync<NotionFileDb>(`SELECT * FROM notion_files`);
        const tables = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
        console.log("Tables in the database:", tables.map(row => row.name));
        return result;
    } catch (error) {
        console.error('Error fetching Notion files:', error);
        throw error;
    }
}

export async function deleteNotionFile(id: number): Promise<void> {
    try {
        const dbManager = DatabaseManager.getInstance();
        const db = await dbManager.getDbInstance();
        await db.runAsync(`DELETE FROM notion_files WHERE id = ?`, [id]);
        console.log("Notion file deleted successfully");
    } catch (error) {
        console.error('Error deleting Notion file:', error);
        throw error;
    }
}