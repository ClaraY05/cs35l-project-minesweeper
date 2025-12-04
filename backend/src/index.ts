// runs the server
import 'dotenv/config';
import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// enable CORS before routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // React dev server URL
  credentials: true                // if you use cookies/sessions
}));

app.use("/api", routes); // declares /api as the base url 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Minesweeper API listening on port ${PORT}`);
});
