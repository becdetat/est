import { describe, it, expect, beforeEach, vi } from "vitest";
import { ParticipantService } from "../src/services/participantService";
import prisma from "../src/config/database";

// Mock Prisma client
vi.mock("../src/config/database", () => ({
    default: {
        participant: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            findMany: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

describe("ParticipantService", () => {
    let participantService: ParticipantService;

    beforeEach(() => {
        participantService = new ParticipantService();
        vi.clearAllMocks();
    });

    describe("joinSession", () => {
        it("should create a new participant", async () => {
            const mockParticipant = {
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
                email: "test@example.com",
                isHost: false,
                createdAt: new Date(),
            };

            (prisma.participant.findUnique as any).mockResolvedValue(null);
            (prisma.participant.create as any).mockResolvedValue(mockParticipant);

            const result = await participantService.joinSession(
                "session-1",
                "participant-1",
                "Test User",
                "test@example.com"
            );

            expect(result).toEqual(mockParticipant);
            expect(prisma.participant.create).toHaveBeenCalledWith({
                data: {
                    id: "participant-1",
                    sessionId: "session-1",
                    name: "Test User",
                    email: "test@example.com",
                    isHost: false,
                },
            });
        });

        it("should return existing participant if already exists", async () => {
            const existingParticipant = {
                id: "participant-1",
                sessionId: "session-1",
                name: "Existing User",
                email: "existing@example.com",
                isHost: false,
                createdAt: new Date(),
            };

            (prisma.participant.findUnique as any).mockResolvedValue(existingParticipant);

            const result = await participantService.joinSession(
                "session-1",
                "participant-1",
                "Test User",
                "test@example.com"
            );

            expect(result).toEqual(existingParticipant);
            expect(prisma.participant.create).not.toHaveBeenCalled();
        });

        it("should create participant without email", async () => {
            const mockParticipant = {
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
                email: undefined,
                isHost: false,
                createdAt: new Date(),
            };

            (prisma.participant.findUnique as any).mockResolvedValue(null);
            (prisma.participant.create as any).mockResolvedValue(mockParticipant);

            const result = await participantService.joinSession(
                "session-1",
                "participant-1",
                "Test User",
                undefined
            );

            expect(result.email).toBeUndefined();
            expect(prisma.participant.create).toHaveBeenCalled();
        });
    });

    describe("getParticipant", () => {
        it("should return participant by ID", async () => {
            const mockParticipant = {
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
                email: "test@example.com",
                isHost: false,
            };

            (prisma.participant.findUnique as any).mockResolvedValue(mockParticipant);

            const result = await participantService.getParticipant("participant-1");

            expect(result).toEqual(mockParticipant);
            expect(prisma.participant.findUnique).toHaveBeenCalledWith({
                where: { id: "participant-1" },
            });
        });

        it("should return null for non-existent participant", async () => {
            (prisma.participant.findUnique as any).mockResolvedValue(null);

            const result = await participantService.getParticipant("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("participantExistsInSession", () => {
        it("should return true if participant exists in session", async () => {
            const mockParticipant = {
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
            };

            (prisma.participant.findFirst as any).mockResolvedValue(mockParticipant);

            const result = await participantService.participantExistsInSession(
                "participant-1",
                "session-1"
            );

            expect(result).toBe(true);
            expect(prisma.participant.findFirst).toHaveBeenCalledWith({
                where: {
                    id: "participant-1",
                    sessionId: "session-1",
                },
            });
        });

        it("should return false if participant does not exist in session", async () => {
            (prisma.participant.findFirst as any).mockResolvedValue(null);

            const result = await participantService.participantExistsInSession(
                "participant-1",
                "session-1"
            );

            expect(result).toBe(false);
        });
    });

    describe("removeParticipant", () => {
        it("should delete a participant and return true", async () => {
            (prisma.participant.delete as any).mockResolvedValue({
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
            });

            const result = await participantService.removeParticipant("participant-1");

            expect(result).toBe(true);
            expect(prisma.participant.delete).toHaveBeenCalledWith({
                where: { id: "participant-1" },
            });
        });

        it("should return false when participant not found", async () => {
            (prisma.participant.delete as any).mockRejectedValue({
                code: "P2025",
            });

            const result = await participantService.removeParticipant("non-existent");

            expect(result).toBe(false);
        });
    });


});
