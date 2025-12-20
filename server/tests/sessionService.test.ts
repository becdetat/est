import { describe, it, expect, beforeEach, vi } from "vitest";
import { SessionService } from "../src/services/sessionService";
import prisma from "../src/config/database";

// Mock Prisma client and nanoid
vi.mock("../src/config/database", () => ({
    default: {
        session: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        participant: {
            findFirst: vi.fn(),
            findMany: vi.fn(),
        },
    },
}));

vi.mock("nanoid", () => ({
    nanoid: vi.fn(() => "test-id-123"),
}));

describe("SessionService", () => {
    let sessionService: SessionService;

    beforeEach(() => {
        sessionService = new SessionService();
        vi.clearAllMocks();
    });

    describe("createSession", () => {
        it("should create a new session with host participant", async () => {
            const mockSession = {
                id: "test-session-id",
                estimationType: "FIBONACCI",
                participants: [
                    {
                        id: "test-host-id",
                        name: "Test Host",
                        email: "test@example.com",
                        isHost: true,
                    },
                ],
            };

            (prisma.session.create as any).mockResolvedValue(mockSession);

            const result = await sessionService.createSession(
                "Test Host",
                "test@example.com",
                "FIBONACCI"
            );

            expect(result).toHaveProperty("sessionId");
            expect(result).toHaveProperty("hostParticipantId");
            expect(prisma.session.create).toHaveBeenCalledTimes(1);
        });

        it("should handle session creation without email", async () => {
            const mockSession = {
                id: "test-session-id",
                estimationType: "TSHIRT",
                participants: [
                    {
                        id: "test-host-id",
                        name: "Test Host",
                        isHost: true,
                    },
                ],
            };

            (prisma.session.create as any).mockResolvedValue(mockSession);

            const result = await sessionService.createSession("Test Host", undefined, "TSHIRT");

            expect(result.sessionId).toBeDefined();
            expect(prisma.session.create).toHaveBeenCalled();
        });
    });

    describe("getSession", () => {
        it("should return session with participants and features", async () => {
            const mockSession = {
                id: "test-session",
                estimationType: "FIBONACCI",
                participants: [],
                features: [],
            };

            (prisma.session.findUnique as any).mockResolvedValue(mockSession);

            const result = await sessionService.getSession("test-session");

            expect(result).toBeDefined();
            expect(result?.session).toEqual(mockSession);
        });

        it("should return null for non-existent session", async () => {
            (prisma.session.findUnique as any).mockResolvedValue(null);

            const result = await sessionService.getSession("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("isHost", () => {
        it("should return true for host participant", async () => {
            (prisma.participant.findFirst as any).mockResolvedValue({
                id: "host-id",
                isHost: true,
            });

            const result = await sessionService.isHost("session-id", "host-id");

            expect(result).toBe(true);
        });

        it("should return false for non-host participant", async () => {
            (prisma.participant.findFirst as any).mockResolvedValue(null);

            const result = await sessionService.isHost("session-id", "participant-id");

            expect(result).toBe(false);
        });
    });
});
