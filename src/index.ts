import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import chartRoutes from "./chartRoutes";

const app = express();

// Enable CORS for frontend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Proxy FRED API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api.stlouisfed.org",
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // Removes '/api' prefix
  })
);

// Routes
app.use("api/chart", chartRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
