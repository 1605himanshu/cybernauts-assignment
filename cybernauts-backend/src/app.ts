import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));

// API routes
app.use("/api/users", userRoutes);

// global error handler (basic)
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

export default app;
