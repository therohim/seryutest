import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs-extra';
import * as path from 'path';
import { Pool, QueryResult } from 'pg'; // Using pg for PostgreSQL database interaction

async function migrate() {
    const pool = new Pool({
        user: process.env.POSTGRES_USERNAME,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();

    try {
        // Read SQL migration files from directory
        const migrationDir = path.join(__dirname, 'migrations');
        const files = await fs.readdir(migrationDir);

        // Process each SQL file sequentially
        for (const file of files) {
            if (file.endsWith('.sql')) {
                const filePath = path.join(migrationDir, file);
                const sql = await fs.readFile(filePath, 'utf-8');

                console.log(`Executing migration script: ${file}`);

                // Execute SQL script
                const result: QueryResult = await client.query(sql);
                console.log(`Migration script executed successfully: ${file}`);
            }
        }

        console.log('All migration scripts executed successfully');
    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        client.release(); // Release the client back to the pool
        await pool.end(); // Close the database connection pool
    }
}

migrate();
