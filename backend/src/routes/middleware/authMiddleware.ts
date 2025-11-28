import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "christinawang";

export interface AuthRequest extends Request{
    user?: any;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction){
    const token = req.cookies?.token;
    
    if(!token){
        return res.sendStatus(401); // no token, unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err:VerifyErrors|null, decoded:any) =>{
        if (err){
            return res.sendStatus(403); // invalid token
        }
        req.user = decoded;
        next();
    });
}