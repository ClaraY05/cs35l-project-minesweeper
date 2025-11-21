import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "christinawang";

export interface AuthRequest extends Request{
    user?: any;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token){
        return res.sendStatus(401); // no token, unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) =>{
        if (err){
            return res.sendStatus(403); // invalid token
        }
        req.user = user;
        next();
    });
}