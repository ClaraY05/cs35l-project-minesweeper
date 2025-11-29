import { Router } from "express";
import { pool } from "../../db/db";
import { authenticateToken } from "../middleware/authMiddleware";


const settingsRoutes = Router();