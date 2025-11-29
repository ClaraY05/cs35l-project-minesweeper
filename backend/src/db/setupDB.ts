import { pool } from "./db"

export async function setupDB(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
            game_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            rows INT NOT NULL,
            cols INT NOT NULL,
            mines INT NOT NULL,
            status TEXT NOT NULL DEFAULT 'waiting', --waiting|play|end_win|end_lose
            started_at TIMESTAMP NULL,
            ended_at TIMESTAMP NULL,
            diff_level TEXT NOT NULL,
            score INT,
            created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("tables created successfully");
    } catch(err){
        console.error("error creating tables:", err);
    }
}
setupDB();
