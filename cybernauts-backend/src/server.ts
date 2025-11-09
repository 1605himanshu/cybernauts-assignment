import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

    // graceful shutdown
    const shutdown = () => {
      console.log("🔴 Shutting down server...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
      // Force exit after 10s
      setTimeout(() => process.exit(1), 10_000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
