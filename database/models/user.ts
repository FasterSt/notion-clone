import { DatabaseManager } from "@/database/base";

export interface UserDb {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export type User = Omit<UserDb, 'id' | 'createdAt' | 'updatedAt'>;

export async function createUser({name, email, }: User): Promise<void> {
    try {
        const dbManager = DatabaseManager.getInstance();
        const db = await dbManager.getDbInstance();
        await db.runAsync('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        console.log("User created successfully");
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
