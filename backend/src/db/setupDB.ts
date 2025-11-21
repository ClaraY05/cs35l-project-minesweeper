import { pool } from "./db"

export async function setupDB(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("tables created successfully");
    } catch(err){
        console.error("error creating tables:", err);
    }
}
setupDB();
