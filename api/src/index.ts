// runs the server
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes); // declares /api as the base url 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Minesweeper API listening on port ${PORT}`);
});
