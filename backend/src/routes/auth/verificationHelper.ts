import { pool } from "../../db/db.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.VERIFY_SECRET || "christinawang";
const JWT_EXPIRES_IN = "15m";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export async function createVerificationToken(userID: number) {
    try{
        const emailToken = jwt.sign({userID: userID}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        return emailToken;
    } catch (err){
        throw new Error("failed to generate verification token");
    }
}

export async function sendVerificationEmail(to: string, emailToken: string) {
    const verifyUrl = `${process.env.APP_URL}/verify?emailToken=${emailToken}`;
    try{
        await transporter.sendMail({
            from: `"Sweeper" <${process.env.SMTP_USER}>`,
            to,
            subject: "Verify your email Sweeper.io",
            text: `Click to verify: ${verifyUrl}`,
            html: `<p>Click to verify:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
        });
    } catch(err){
        throw new Error("failed to send verification email");
    }
}

export async function verifyEmailToken(emailToken: string) {
    try{
        const decoded = jwt.verify(emailToken, JWT_SECRET) as { userID: number };
        await pool.query("UPDATE users SET is_verified=true WHERE user_id=$1", [decoded.userID]);
        return decoded.userID;
    } catch (err){
        throw new Error("invalid or expired verification token");
    }
}
