import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "christinawang";

export interface AuthRequest extends Request{
    user?: any;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction){
    const token = req.cookies?.token;
    
    if(!token){
        return res.sendStatus(401); // no token, unauthorized
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userID = decoded.userID;
        const result = await pool.query("SELECT is_verified FROM users WHERE user_id = $1",[userID]);
        if (result.rows.length===0){
            return res.status(401).json({error:"user not found"});
        }
        // check user email is verified
        if (!result.rows[0].is_verified){
            return res.status(403).json({error:"email not verified"})
        }
        req.user = decoded;
        next();
    } catch(err){
        res.status(403).json({error:"invalid token"});
    }
}