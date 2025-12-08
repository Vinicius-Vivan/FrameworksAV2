import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import itemsRouter from "./routes/items.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "backend", version: "0.1.0" });
});

app.use("/api/items", itemsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
