export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

class UsersDb {
    private static instance: User;

    public async createUser(): Promise<void> {
        try {
            const dbManager = DatabaseManager.getInstance();
            const db = await dbManager.getDbInstance();
            await db.runAsync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [this.name, this.email, this.password]);
            console.log("User created successfully");
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}