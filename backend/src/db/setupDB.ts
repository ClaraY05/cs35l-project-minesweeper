import { pool } from "./db"

export async function setupDB(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT GENERATED ALWAYS AS IDENTITY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY(user_id)
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXTSTS scores (
                score_id INT GENERATED ALWAYS AS IDENTITY,
                score INT NOT NULL,
                created_at TIMESTAMPE DEFAULT NOW(),
                PRIMARY KEY(score_id),
                CONSTRAINT fk_user
                    FOREIGN KEY(user_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
            );
        `)
        console.log("tables created successfully");
    } catch(err){
        console.error("error creating tables:", err);
    }
}
setupDB();
