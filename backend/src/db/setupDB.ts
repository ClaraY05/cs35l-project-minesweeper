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
            CREATE TABLE IF NOT EXISTS scores (
                score_id INT GENERATED ALWAYS AS IDENTITY,
                user_id INT NOT NULL,
                score INT,
                game_id INT NOT NULL,
                game_status TEXT NOT NULL,
                diff_level TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY(score_id),
                CONSTRAINT fk_user
                    FOREIGN KEY(user_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
            );
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS friends (
                friends_id INT GENERATED ALWAYS AS IDENTITY,
                user_id INT NOT NULL,
                friend_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY(friends_id),
                CONSTRAINT fk_user_friend
                    FOREIGN KEY(user_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_friend
                    FOREIGN KEY(friend_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
            );
        `);
        console.log("tables created successfully");
    } catch(err){
        console.error("error creating tables:", err);
    }
}
setupDB();
