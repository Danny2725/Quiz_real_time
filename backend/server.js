import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"; // Nếu bạn có tệp này
import connectMongoDB from "./db/connectMongoDB.js";
import initializeSocketServer from "./socketServer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // để phân tích req.body
app.use(express.urlencoded({ extended: true })); // để phân tích dữ liệu form (urlencoded)
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use("/api/auth", authRoutes); // Nếu bạn có tệp này

// Kết nối MongoDB
connectMongoDB();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const httpServer = createServer(app);
initializeSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
