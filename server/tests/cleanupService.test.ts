import { describe, it, expect, beforeEach, vi } from "vitest";
import { CleanupService } from "../src/services/cleanupService";
import prisma from "../src/config/database";

// Mock Prisma client
vi.mock("../src/config/database", () => ({
    default: {
        session: {
            deleteMany: vi.fn(),
            count: vi.fn(),
            delete: vi.fn(),
            findFirst: vi.fn(),
        },
    },
}));

describe("CleanupService", () => {
    let cleanupService: CleanupService;

    beforeEach(() => {
        cleanupService = new CleanupService();
        vi.clearAllMocks();
    });

    describe("deleteOldSessions", () => {
        it("should delete sessions older than 28 days by default", async () => {
            const mockResult = { count: 5 };
            (prisma.session.deleteMany as any).mockResolvedValue(mockResult);

            const result = await cleanupService.deleteOldSessions();

            expect(result).toBe(5);
            expect(prisma.session.deleteMany).toHaveBeenCalledTimes(1);
            expect(prisma.session.deleteMany).toHaveBeenCalledWith({
                where: {
                    createdAt: {
                        lt: expect.any(Date),
                    },
                },
            });
        });

        it("should delete sessions older than specified days", async () => {
            const mockResult = { count: 3 };
            (prisma.session.deleteMany as any).mockResolvedValue(mockResult);

            const result = await cleanupService.deleteOldSessions(14);

            expect(result).toBe(3);
            expect(prisma.session.deleteMany).toHaveBeenCalledTimes(1);
        });

        it("should handle errors gracefully", async () => {
            const mockError = new Error("Database error");
            (prisma.session.deleteMany as any).mockRejectedValue(mockError);

            await expect(cleanupService.deleteOldSessions()).rejects.toThrow("Database error");
        });
    });

    describe("getOldSessionsCount", () => {
        it("should return count of old sessions", async () => {
            (prisma.session.count as any).mockResolvedValue(10);

            const result = await cleanupService.getOldSessionsCount(28);

            expect(result).toBe(10);
            expect(prisma.session.count).toHaveBeenCalledTimes(1);
        });

        it("should handle errors when counting", async () => {
            const mockError = new Error("Count error");
            (prisma.session.count as any).mockRejectedValue(mockError);

            await expect(cleanupService.getOldSessionsCount()).rejects.toThrow("Count error");
        });
    });

    describe("deleteSession", () => {
        it("should delete a specific session and return true", async () => {
            (prisma.session.delete as any).mockResolvedValue({ id: "test-session" });

            const result = await cleanupService.deleteSession("test-session");

            expect(result).toBe(true);
            expect(prisma.session.delete).toHaveBeenCalledWith({
                where: { id: "test-session" },
            });
        });

        it("should return false when session not found", async () => {
            const mockError: any = new Error("Not found");
            mockError.code = "P2025";
            (prisma.session.delete as any).mockRejectedValue(mockError);

            const result = await cleanupService.deleteSession("non-existent");

            expect(result).toBe(false);
        });

        it("should throw error for other database errors", async () => {
            const mockError = new Error("Database error");
            (prisma.session.delete as any).mockRejectedValue(mockError);

            await expect(cleanupService.deleteSession("test-session")).rejects.toThrow(
                "Database error"
            );
        });
    });

    describe("isSessionValid", () => {
        it("should return true for valid session", async () => {
            (prisma.session.findFirst as any).mockResolvedValue({ id: "test-session" });

            const result = await cleanupService.isSessionValid("test-session");

            expect(result).toBe(true);
        });

        it("should return false when session not found", async () => {
            (prisma.session.findFirst as any).mockResolvedValue(null);

            const result = await cleanupService.isSessionValid("non-existent");

            expect(result).toBe(false);
        });

        it("should return false on database error", async () => {
            const mockError = new Error("Database error");
            (prisma.session.findFirst as any).mockRejectedValue(mockError);

            const result = await cleanupService.isSessionValid("test-session");

            expect(result).toBe(false);
        });
    });
});
