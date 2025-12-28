import { describe, it, expect, beforeEach, vi } from "vitest";
import { FeatureService } from "../src/services/featureService";
import prisma from "../src/config/database";

// Mock Prisma client and nanoid
vi.mock("../src/config/database", () => ({
    default: {
        feature: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
            update: vi.fn(),
        },
        vote: {
            upsert: vi.fn(),
            findMany: vi.fn(),
            deleteMany: vi.fn(),
        },
    },
}));

vi.mock("nanoid", () => ({
    nanoid: vi.fn(() => "test-id-123"),
}));

describe("FeatureService", () => {
    let featureService: FeatureService;

    beforeEach(() => {
        featureService = new FeatureService();
        vi.clearAllMocks();
    });

    describe("createFeature", () => {
        it("should create a new feature with name and link", async () => {
            const mockFeature = {
                id: "test-feature-id",
                sessionId: "test-session-id",
                name: "Test Feature",
                link: "https://example.com",
                isRevealed: false,
                createdAt: new Date(),
            };

            (prisma.feature.create as any).mockResolvedValue(mockFeature);

            const result = await featureService.createFeature(
                "test-session-id",
                "Test Feature",
                "https://example.com"
            );

            expect(result).toEqual(mockFeature);
            expect(prisma.feature.create).toHaveBeenCalledWith({
                data: {
                    id: "test-id-123",
                    sessionId: "test-session-id",
                    name: "Test Feature",
                    link: "https://example.com",
                    isRevealed: false,
                },
            });
        });

        it("should create a feature without name and link", async () => {
            const mockFeature = {
                id: "test-feature-id",
                sessionId: "test-session-id",
                name: undefined,
                link: undefined,
                isRevealed: false,
                createdAt: new Date(),
            };

            (prisma.feature.create as any).mockResolvedValue(mockFeature);

            const result = await featureService.createFeature("test-session-id", undefined, undefined);

            expect(result).toEqual(mockFeature);
            expect(prisma.feature.create).toHaveBeenCalled();
        });
    });

    describe("getFeature", () => {
        it("should return feature with votes", async () => {
            const mockFeature = {
                id: "test-feature-id",
                sessionId: "test-session-id",
                name: "Test Feature",
                isRevealed: false,
                votes: [
                    {
                        id: "vote-1",
                        featureId: "test-feature-id",
                        participantId: "participant-1",
                        value: "5",
                        participant: { id: "participant-1", name: "Test User" },
                    },
                ],
            };

            (prisma.feature.findUnique as any).mockResolvedValue(mockFeature);

            const result = await featureService.getFeature("test-feature-id");

            expect(result).toEqual(mockFeature);
            expect(prisma.feature.findUnique).toHaveBeenCalledWith({
                where: { id: "test-feature-id" },
                include: {
                    votes: {
                        include: {
                            participant: true,
                        },
                    },
                },
            });
        });
    });

    describe("submitVote", () => {
        it("should create a new vote", async () => {
            const mockVote = {
                id: "test-vote-id",
                featureId: "feature-1",
                participantId: "participant-1",
                value: "8",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.vote.upsert as any).mockResolvedValue(mockVote);

            const result = await featureService.submitVote("feature-1", "participant-1", "8");

            expect(result).toEqual(mockVote);
            expect(prisma.vote.upsert).toHaveBeenCalledWith({
                where: {
                    featureId_participantId: {
                        featureId: "feature-1",
                        participantId: "participant-1",
                    },
                },
                update: {
                    value: "8",
                },
                create: {
                    id: "test-id-123",
                    featureId: "feature-1",
                    participantId: "participant-1",
                    value: "8",
                },
            });
        });

        it("should update an existing vote", async () => {
            const mockVote = {
                id: "existing-vote-id",
                featureId: "feature-1",
                participantId: "participant-1",
                value: "13",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.vote.upsert as any).mockResolvedValue(mockVote);

            const result = await featureService.submitVote("feature-1", "participant-1", "13");

            expect(result.value).toBe("13");
            expect(prisma.vote.upsert).toHaveBeenCalled();
        });
    });

    describe("deleteVote", () => {
        it("should delete a vote", async () => {
            const mockDeleteResult = { count: 1 };

            (prisma.vote.deleteMany as any).mockResolvedValue(mockDeleteResult);

            const result = await featureService.deleteVote("feature-1", "participant-1");

            expect(result).toEqual(mockDeleteResult);
            expect(prisma.vote.deleteMany).toHaveBeenCalledWith({
                where: {
                    featureId: "feature-1",
                    participantId: "participant-1",
                },
            });
        });
    });

    describe("getCurrentFeature", () => {
        it("should return the current unrevealed feature", async () => {
            const mockFeature = {
                id: "current-feature",
                sessionId: "session-1",
                name: "Current Feature",
                isRevealed: false,
                votes: [],
            };

            (prisma.feature.findFirst as any).mockResolvedValue(mockFeature);

            const result = await featureService.getCurrentFeature("session-1");

            expect(result).toEqual(mockFeature);
            expect(prisma.feature.findFirst).toHaveBeenCalledWith({
                where: {
                    sessionId: "session-1",
                    isRevealed: false,
                },
                include: {
                    votes: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        });

        it("should return null if no unrevealed feature exists", async () => {
            (prisma.feature.findFirst as any).mockResolvedValue(null);

            const result = await featureService.getCurrentFeature("session-1");

            expect(result).toBeNull();
        });
    });

    describe("revealResults", () => {
        it("should mark a feature as revealed", async () => {
            const mockFeature = {
                id: "feature-1",
                sessionId: "session-1",
                name: "Test Feature",
                isRevealed: true,
                votes: [
                    { id: "vote-1", value: "5", participantId: "p1" },
                    { id: "vote-2", value: "8", participantId: "p2" },
                ],
            };

            (prisma.feature.update as any).mockResolvedValue(mockFeature);

            const result = await featureService.revealResults("feature-1");

            expect(result).toEqual(mockFeature);
            expect(prisma.feature.update).toHaveBeenCalledWith({
                where: { id: "feature-1" },
                data: { isRevealed: true },
                include: {
                    votes: {
                        include: {
                            participant: true,
                        },
                    },
                },
            });
        });
    });

    describe("getVotes", () => {
        it("should return all votes for a feature", async () => {
            const mockVotes = [
                {
                    id: "vote-1",
                    featureId: "feature-1",
                    participantId: "p1",
                    value: "5",
                    participant: { id: "p1", name: "User 1" },
                },
                {
                    id: "vote-2",
                    featureId: "feature-1",
                    participantId: "p2",
                    value: "8",
                    participant: { id: "p2", name: "User 2" },
                },
            ];

            (prisma.vote.findMany as any).mockResolvedValue(mockVotes);

            const result = await featureService.getVotes("feature-1");

            expect(result).toEqual(mockVotes);
            expect(prisma.vote.findMany).toHaveBeenCalledWith({
                where: { featureId: "feature-1" },
                include: {
                    participant: true,
                },
            });
        });
    });
});
