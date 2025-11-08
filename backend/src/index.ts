// runs the server
import 'dotenv/config';
import express from "express";
import cors from "cors";
import routes from "./routes/routes";

const app = express();
app.use(express.json());

// enable CORS before routes
app.use(cors({
  origin: "http://localhost:5173", // React dev server URL
  credentials: true                // if you use cookies/sessions
}));

app.use("/api", routes); // declares /api as the base url 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Minesweeper API listening on port ${PORT}`);
});
