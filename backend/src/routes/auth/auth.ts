import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/db";
import { DEFAULT_SETTINGS } from "../settings/defaultSettings";
import { createVerificationToken, sendVerificationEmail, verifyEmailToken } from "./verificationHelper";

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
            
            // create new user in database
            const result = await pool.query(
                "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, profile_picture",
                [username, email, hash]
            );

            const userID = result.rows[0].user_id;

            // save default settings to database
            await pool.query(
                "INSERT INTO settings (user_id, keybinds, sound, video, notif) VALUES ($1,$2,$3,$4,$5)",
                [userID, DEFAULT_SETTINGS.keybinds, DEFAULT_SETTINGS.sound, DEFAULT_SETTINGS.video, DEFAULT_SETTINGS.notif]
            );

            // sent verification email
            const emailToken = await createVerificationToken(userID);
            await sendVerificationEmail(email, emailToken);

            return res.status(201).json({
                user:{user_id:userID, email:email, username:username, profile_picture: result.rows[0].profile_picture},
                is_verified:false,
                message: "check email to verify"
            });
        }
        catch(err: any) {
            console.error(err);
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
        const result = await pool.query("SELECT user_id, username, email, password_hash, profile_picture, is_verified FROM users WHERE email = $1", [email]);
        
        // if user doesn't exist and login request
        if(result.rows.length===0){
            return res.status(401).json({error:"Invalid email or password"});
        }

        const user = result.rows[0];

        if(!user.is_verified){
            return res.status(403).json({error:"email not verified"});
        }
        
        // Compare the passwords with the hash in the database
        const isValid = await bcrypt.compare(password, user.password_hash);
        if(!isValid){
            return res.status(401).json({error: "Invalid username or password"});
        }

        const userID = user.user_id;
        const username = user.username;
        const token = signJwt({ userID, email, username });

        res.cookie("token",token,{httpOnly:true, secure:false, sameSite:"lax", maxAge:60*60*1000});

        return res.status(200).json({user:{user_id: userID, email:email, username:user.username, profile_picture: user.profile_picture}});
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
    
})

// clear token in cookie on logout
authRoutes.post("/logout", (req,res)=>{
    res.clearCookie("token", {httpOnly:true, sameSite:"lax", secure:false});
    return res.status(200).json({message: "Logged out"})
})

// called when user clicks link in email
authRoutes.post("/verify", async (req,res)=>{
    try{
        const {emailToken} = req.body;
        await verifyEmailToken(emailToken);
        return res.json({message:"email verified"});
    }
    catch(err){
        return res.status(400).json({error:"email not verified"});
    }
});


export default authRoutes;