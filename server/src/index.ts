import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeScheduledJobs } from "./utils/scheduler";
import prisma from "./config/database";
import apiRoutes from "./routes/api";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import SocketHandler from "./socket/handlers";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
}));
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use("/api", apiRoutes);

// Serve static files in production
if (isProduction) {
    const clientBuildPath = path.join(__dirname, "../../client/dist");
    app.use(express.static(clientBuildPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (_req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
} else {
    // In development, 404 handler for non-API routes
    app.use(notFoundHandler);
}

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO handlers
const socketHandler = new SocketHandler(io);
socketHandler.initializeHandlers();

// Initialize scheduled cleanup jobs
initializeScheduledJobs();

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("\nShutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\nShutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export { app, io };
