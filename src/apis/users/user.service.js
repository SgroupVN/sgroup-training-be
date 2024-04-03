import Database from '../../database/query';

class UserService {
    constructor() {
        this.db = new Database();
    }

    async getAll(username) {
        try {
            const users = await this.db.select('SELECT * FROM users');
            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    async getUserWithPaging(page, size, username) {
        try {
            const query = `
                SELECT *
                FROM users
                WHERE USERNAME LIKE ?
                LIMIT ?
                OFFSET ?
            `;
            const params = [`%${username ?? ''}%`, size, (page - 1) * size];
            const users = await this.db.select(query, params);
            return users;
        } catch (error) {
            console.error('Error fetching users with paging:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const query = 'SELECT * FROM users WHERE ID = ?';
            const user = await this.db.select(query, [id]);
            return user[0];
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            throw error;
        }
    }

    async create(user) {
        try {
            const query = `
                INSERT INTO users (NAME, AGE, GENDER, PASSWORD, CREATEDBY)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [user.fullname, user.age, user.gender, user.password, user.createdBy];
            const id = await this.db.insert(query, params);
            user.id = id;
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id, user) {
        try {
            const query = `
                UPDATE users
                SET NAME = ?, AGE = ?, GENDER = ?, PASSWORD = ?
                WHERE ID = ?
            `;
            const params = [user.fullname, user.age, user.gender, user.password, id];
            await this.db.update(query, params);
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error;
        }
    }

    async removeById(id) {
        try {
            const query = 'DELETE FROM users WHERE ID = ?';
            await this.db.delete(query, [id]);
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw error;
        }
    }
}

export default new UserService();
