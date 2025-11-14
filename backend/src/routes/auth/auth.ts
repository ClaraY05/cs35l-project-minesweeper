import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { pool } from "../../db/db"

// routes for our api.
const authRoutes = Router();

console.log("Environment loaded. PORT:", process.env.PORT);

const JWT_SECRET = process.env.JWT_SECRET || "christinawang";
const JWT_EXPIRES_IN = "1h";

function signJwt(payload: object){
    const jwtobj = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
    return jwtobj;
}

authRoutes.post(
    "/register", async(req:Request, res:Response) => {
        const { username, password } = req.body;

        try {
            const hash = await bcrypt.hash(password, 10);
            
            const result = await pool.query(
                "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
                [username, hash]
            );

            const userID = result.rows[0].id;
            const token = signJwt({ userID, username});

            return res.status(201).json({token});
        }
        catch(err) {
            console.error(err);
        }
    }
)

authRoutes.post("/login", async(req:Request, res:Response)=>{
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        
        if(!isValid){
            return res.status(401).json({error: "Invalid username or password"});
        }

        const userID = user.id;
        const token = signJwt({ userID, username});

        return res.status(200).json({token});
    }
    catch(err) {
        console.error(err);
    }
    
})


export default authRoutes;