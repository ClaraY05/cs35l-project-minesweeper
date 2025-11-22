import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/db";

// routes for our api.
const authRoutes = Router();

console.log("Environment loaded. PORT:", process.env.PORT);

const JWT_SECRET = process.env.JWT_SECRET || "christinawang";
const JWT_EXPIRES_IN = "1h";

function signJwt(payload: object){
    const jwtobj = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return jwtobj;
}

authRoutes.post("/register", async(req:Request, res:Response) => {
        const { username, email, password } = req.body;

        if(!username||!email||!password){
            return res.status(400).json({error:"Username, email, password required."})
        }

        try {
            // make sure existing user doesn't sign up again
            const userExist = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
            if(userExist.rows.length!==0){
                return res.status(409).json({error:"Email already registered"});
            }
            // check username uniqueness
            const takenUsername = await pool.query("SELECT user_id FROM users WHERE username = $1", [username]);
            if(takenUsername.rows.length>0){
                return res.status(409).json({error:"Username already taken"});
            }
            
            const hash = await bcrypt.hash(password, 10);
            
            const result = await pool.query(
                "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email",
                [username, email, hash]
            );

            const userID = result.rows[0].user_id;
            const token = signJwt({ userID, email, username });

            return res.status(201).json({token, user:{user_id:userID, email:email, username:username}});
        }
        // Catch if username is in db already
        catch(err: any) {
            console.error(err);
            // if (err.code === '23505') { // Unique violation
            //     return res.status(409).json({error: "Username already exists"});
            // }
            return res.status(500).json({error: "Internal server error"});
        }
    }
)

authRoutes.post("/login", async(req:Request, res:Response)=>{
    const { email, password } = req.body;

    if (!email||!password){
        return res.status(400).json({error:"Email and password required"});
    }

    try {
        const result = await pool.query("SELECT user_id, username, email, password_hash FROM users WHERE email = $1", [email]);
        
        // if user doesn't exist and login request
        if(result.rows.length===0){
            return res.status(401).json({error:"Invalid email or password"});
        }

        // Compare the passwords with the hash in the database
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        
        if(!isValid){
            return res.status(401).json({error: "Invalid username or password"});
        }

        const userID = user.user_id;
        const username = user.username;
        const token = signJwt({ userID, email, username });

        return res.status(200).json({token, user:{user_id: userID, email:email, username:user.username}});
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
    
})


export default authRoutes;