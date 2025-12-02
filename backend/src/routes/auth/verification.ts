import { pool } from "../../db/db";
import nodemailer from "nodemailer";
import jwt, { VerifyErrors } from "jsonwebtoken";

const JWT_SECRET = process.env.VERIFY_SECRET || "christinawang";
const JWT_EXPIRES_IN = "15m";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function createVerificationToken(userId: number) {
    const emailToken = jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    return emailToken;
}

export async function sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${process.env.APP_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: `"Sweeper" <${process.env.SMTP_USER}>`,
        to,
        subject: "Verify your email Sweeper.io",
        text: `Click to verify: ${verifyUrl}`,
        html: `<p>Click to verify:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
}

export async function verifyToken(token: string) {
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        await pool.query("UPDATE users SET is_verified=true WHERE user_id=$1", [decoded.userId]);
        return decoded.userId
    } catch (err){
        throw new Error("invalid or expired verification token");
    }
}
