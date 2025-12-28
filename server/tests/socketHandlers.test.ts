import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Server as IOServer } from "socket.io";
import { Socket } from "socket.io";
import { SocketHandler } from "../src/socket/handlers";
import sessionService from "../src/services/sessionService";
import featureService from "../src/services/featureService";
import participantService from "../src/services/participantService";
import cleanupService from "../src/services/cleanupService";

// Mock services
vi.mock("../src/services/sessionService");
vi.mock("../src/services/featureService");
vi.mock("../src/services/participantService");
vi.mock("../src/services/cleanupService");

describe("SocketHandler", () => {
    let io: IOServer;
    let socketHandler: SocketHandler;
    let mockSocket: Partial<Socket>;
    let mockRoom: Set<string>;

    beforeEach(() => {
        mockRoom = new Set();
        
        // Mock Socket.IO server
        io = {
            on: vi.fn(),
            to: vi.fn(() => ({
                emit: vi.fn(),
            })),
        } as any;

        // Mock socket
        mockSocket = {
            id: "test-socket-id",
            on: vi.fn(),
            emit: vi.fn(),
            join: vi.fn((room: string) => {
                mockRoom.add(room);
            }),
            data: {},
        };

        socketHandler = new SocketHandler(io);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("handleJoinSession", () => {
        it("should allow participant to join a valid session", async () => {
            const joinData = {
                sessionId: "session-1",
                participantId: "participant-1",
            };

            vi.mocked(cleanupService.isSessionValid).mockResolvedValue(true);
            vi.mocked(participantService.participantExistsInSession).mockResolvedValue(true);
            vi.mocked(participantService.getParticipant).mockResolvedValue({
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
                email: null,
                isHost: false,
                createdAt: new Date(),
            });
            vi.mocked(sessionService.getSession).mockResolvedValue({
                session: {
                    id: "session-1",
                    estimationType: "FIBONACCI",
                    participants: [],
                    features: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                currentFeature: null,
            });

            // Manually call the private handler through initialization
            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            // Get the join-session handler
            const joinHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "join-session"
            )?.[1];

            if (joinHandler) {
                await joinHandler(joinData);
            }

            expect(mockSocket.join).toHaveBeenCalledWith("session-1");
        });

        it("should reject join for invalid session", async () => {
            const joinData = {
                sessionId: "invalid-session",
                participantId: "participant-1",
            };

            vi.mocked(cleanupService.isSessionValid).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const joinHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "join-session"
            )?.[1];

            if (joinHandler) {
                await joinHandler(joinData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Session not found or expired",
            });
        });

        it("should reject join for non-existent participant", async () => {
            const joinData = {
                sessionId: "session-1",
                participantId: "invalid-participant",
            };

            vi.mocked(cleanupService.isSessionValid).mockResolvedValue(true);
            vi.mocked(participantService.participantExistsInSession).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const joinHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "join-session"
            )?.[1];

            if (joinHandler) {
                await joinHandler(joinData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Participant not found in session",
            });
        });
    });

    describe("handleSubmitVote", () => {
        it("should allow participant to submit vote", async () => {
            const voteData = {
                sessionId: "session-1",
                featureId: "feature-1",
                participantId: "participant-1",
                value: "8",
            };

            vi.mocked(participantService.participantExistsInSession).mockResolvedValue(true);
            vi.mocked(featureService.submitVote).mockResolvedValue({
                id: "vote-1",
                featureId: "feature-1",
                participantId: "participant-1",
                value: "8",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const submitVoteHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "submit-vote"
            )?.[1];

            if (submitVoteHandler) {
                await submitVoteHandler(voteData);
            }

            expect(featureService.submitVote).toHaveBeenCalledWith(
                "feature-1",
                "participant-1",
                "8"
            );
        });

        it("should reject vote from unauthorized participant", async () => {
            const voteData = {
                sessionId: "session-1",
                featureId: "feature-1",
                participantId: "invalid-participant",
                value: "8",
            };

            vi.mocked(participantService.participantExistsInSession).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const submitVoteHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "submit-vote"
            )?.[1];

            if (submitVoteHandler) {
                await submitVoteHandler(voteData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Unauthorized",
            });
            expect(featureService.submitVote).not.toHaveBeenCalled();
        });
    });

    describe("handleUnsubmitVote", () => {
        it("should allow participant to remove their vote", async () => {
            const unvoteData = {
                sessionId: "session-1",
                featureId: "feature-1",
                participantId: "participant-1",
            };

            vi.mocked(participantService.participantExistsInSession).mockResolvedValue(true);
            vi.mocked(featureService.deleteVote).mockResolvedValue({ count: 1 });

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const unsubmitVoteHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "unsubmit-vote"
            )?.[1];

            if (unsubmitVoteHandler) {
                await unsubmitVoteHandler(unvoteData);
            }

            expect(featureService.deleteVote).toHaveBeenCalledWith("feature-1", "participant-1");
        });
    });

    describe("handleStartFeature", () => {
        it("should allow host to start a new feature", async () => {
            const featureData = {
                sessionId: "session-1",
                participantId: "host-1",
                name: "New Feature",
                link: "https://example.com",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(true);
            vi.mocked(featureService.createFeature).mockResolvedValue({
                id: "feature-1",
                sessionId: "session-1",
                name: "New Feature",
                link: "https://example.com",
                isRevealed: false,
                createdAt: new Date(),
            });

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const startFeatureHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "start-feature"
            )?.[1];

            if (startFeatureHandler) {
                await startFeatureHandler(featureData);
            }

            expect(featureService.createFeature).toHaveBeenCalledWith(
                "session-1",
                "New Feature",
                "https://example.com"
            );
        });

        it("should reject feature start from non-host", async () => {
            const featureData = {
                sessionId: "session-1",
                participantId: "participant-1",
                name: "New Feature",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const startFeatureHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "start-feature"
            )?.[1];

            if (startFeatureHandler) {
                await startFeatureHandler(featureData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Only the host can start features",
            });
            expect(featureService.createFeature).not.toHaveBeenCalled();
        });
    });

    describe("handleRevealResults", () => {
        it("should allow host to reveal results", async () => {
            const revealData = {
                sessionId: "session-1",
                featureId: "feature-1",
                participantId: "host-1",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(true);
            vi.mocked(featureService.revealResults).mockResolvedValue({
                id: "feature-1",
                sessionId: "session-1",
                name: "Test Feature",
                link: null,
                isRevealed: true,
                createdAt: new Date(),
                votes: [],
            });

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const revealResultsHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "reveal-results"
            )?.[1];

            if (revealResultsHandler) {
                await revealResultsHandler(revealData);
            }

            expect(featureService.revealResults).toHaveBeenCalledWith("feature-1");
        });

        it("should reject reveal from non-host", async () => {
            const revealData = {
                sessionId: "session-1",
                featureId: "feature-1",
                participantId: "participant-1",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const revealResultsHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "reveal-results"
            )?.[1];

            if (revealResultsHandler) {
                await revealResultsHandler(revealData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Only the host can reveal results",
            });
            expect(featureService.revealResults).not.toHaveBeenCalled();
        });
    });

    describe("handleCloseSession", () => {
        it("should allow host to close session", async () => {
            const closeData = {
                sessionId: "session-1",
                participantId: "host-1",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(true);
            vi.mocked(sessionService.deleteSession).mockResolvedValue(true);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const closeSessionHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "close-session"
            )?.[1];

            if (closeSessionHandler) {
                await closeSessionHandler(closeData);
            }

            expect(sessionService.deleteSession).toHaveBeenCalledWith("session-1");
        });

        it("should reject close from non-host", async () => {
            const closeData = {
                sessionId: "session-1",
                participantId: "participant-1",
            };

            vi.mocked(sessionService.isHost).mockResolvedValue(false);

            socketHandler.initializeHandlers();
            const onHandler = (io.on as any).mock.calls[0][1];
            await onHandler(mockSocket);

            const closeSessionHandler = (mockSocket.on as any).mock.calls.find(
                (call: any) => call[0] === "close-session"
            )?.[1];

            if (closeSessionHandler) {
                await closeSessionHandler(closeData);
            }

            expect(mockSocket.emit).toHaveBeenCalledWith("error", {
                message: "Only the host can close the session",
            });
            expect(sessionService.deleteSession).not.toHaveBeenCalled();
        });
    });
});
