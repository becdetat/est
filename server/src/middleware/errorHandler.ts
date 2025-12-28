import { Request, Response, NextFunction } from "express";

/**
 * Error handling middleware
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.error("[ErrorHandler]", err);

    // Prisma errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).code) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prismaError = err as any;
        switch (prismaError.code) {
            case "P2002":
                return res.status(409).json({ error: "Resource already exists" });
            case "P2025":
                return res.status(404).json({ error: "Resource not found" });
            default:
                return res.status(500).json({ error: "Database error" });
        }
    }

    // Default error
    return res.status(500).json({ error: "Internal server error" });
}

/**
 * 404 handler for unknown routes
 */
export function notFoundHandler(_req: Request, res: Response) {
    res.status(404).json({ error: "Not found" });
}
