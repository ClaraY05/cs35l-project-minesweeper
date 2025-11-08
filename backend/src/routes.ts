import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { pool } from "./db/db"

// routes for our api.
const router = Router();

router.get("/", (req, res) => {
    res.send("hello world");
})

console.log("Environment loaded. PORT:", process.env.PORT);

// JWT authentication
const JWT_SECRET = "";
const JWT_EXPIRES_IN = "1h";

router.post(
    "/api/auth/register",
    async(req:Request, res:Response): Promise<void> =>{
        const { username, password } = req.body;
    }
)


export default router;