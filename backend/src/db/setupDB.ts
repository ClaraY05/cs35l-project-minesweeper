import { pool } from "./db"

export async function setupDB(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                profile_picture TEXT,
                created_at TIMESTAMP DEFAULT NOW()
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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
            user_id INT NOT NULL PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
            keybinds JSONB NOT NULL DEFAULT '{}',
            selectors JSONB NOT NULL DEFAULT '{}',
            sliders JSONB NOT NULL DEFAULT '{}',
            checkboxes JSONB NOT NULL DEFAULT '{}',
            updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("tables created successfully");
    } catch(err){
        console.error("error creating tables:", err);
    }
}
setupDB();
