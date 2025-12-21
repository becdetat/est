import { Server, Socket } from "socket.io";
import featureService from "../services/featureService";
import sessionService from "../services/sessionService";
import participantService from "../services/participantService";
import cleanupService from "../services/cleanupService";

interface SocketData {
    sessionId?: string;
    participantId?: string;
}

/**
 * Socket.IO event handlers for real-time communication
 */
export class SocketHandler {
    private io: Server;
    private participantSockets: Map<string, string>; // participantId -> socketId
    private disconnectTimers: Map<string, NodeJS.Timeout>; // participantId -> timeout

    constructor(io: Server) {
        this.io = io;
        this.participantSockets = new Map();
        this.disconnectTimers = new Map();
    }

    /**
     * Initialize all socket event handlers
     */
    initializeHandlers() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`[Socket] Client connected: ${socket.id}`);

            // Join session event
            socket.on("join-session", async (data: { sessionId: string; participantId: string }) => {
                await this.handleJoinSession(socket, data);
            });

            // Submit vote event
            socket.on(
                "submit-vote",
                async (data: {
                    sessionId: string;
                    featureId: string;
                    participantId: string;
                    value: string;
                }) => {
                    await this.handleSubmitVote(socket, data);
                }
            );

            // Start feature event (host only)
            socket.on(
                "start-feature",
                async (data: {
                    sessionId: string;
                    participantId: string;
                    name?: string;
                    link?: string;
                }) => {
                    await this.handleStartFeature(socket, data);
                }
            );

            // Reveal results event (host only)
            socket.on(
                "reveal-results",
                async (data: { sessionId: string; featureId: string; participantId: string }) => {
                    await this.handleRevealResults(socket, data);
                }
            );

            // Disconnect event
            socket.on("disconnect", () => {
                this.handleDisconnect(socket);
            });
        });
    }

    /**
     * Handle participant joining a session
     */
    private async handleJoinSession(
        socket: Socket,
        data: { sessionId: string; participantId: string }
    ) {
        try {
            const { sessionId, participantId } = data;

            // Validate session
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                socket.emit("error", { message: "Session not found or expired" });
                return;
            }

            // Verify participant exists in session
            const exists = await participantService.participantExistsInSession(
                participantId,
                sessionId
            );
            if (!exists) {
                socket.emit("error", { message: "Participant not found in session" });
                return;
            }

            // Join the session room
            socket.join(sessionId);
            (socket.data as SocketData).sessionId = sessionId;
            (socket.data as SocketData).participantId = participantId;

            // Track participant socket
            this.participantSockets.set(participantId, socket.id);

            // Cancel any pending disconnect timer for this participant (reconnection)
            if (this.disconnectTimers.has(participantId)) {
                clearTimeout(this.disconnectTimers.get(participantId));
                this.disconnectTimers.delete(participantId);
                console.log(`[Socket] Participant ${participantId} reconnected to session ${sessionId}`);
            }

            // Get participant info
            const participant = await participantService.getParticipant(participantId);

            // Notify all participants in the session
            this.io.to(sessionId).emit("participant-joined", {
                participant,
            });

            // Send current session state to the joining participant
            const sessionData = await sessionService.getSession(sessionId);
            socket.emit("session-updated", sessionData);

            console.log(
                `[Socket] Participant ${participantId} joined session ${sessionId}`
            );
        } catch (error) {
            console.error("[Socket] Error handling join-session:", error);
            socket.emit("error", { message: "Failed to join session" });
        }
    }

    /**
     * Handle vote submission
     */
    private async handleSubmitVote(
        socket: Socket,
        data: { sessionId: string; featureId: string; participantId: string; value: string }
    ) {
        try {
            const { sessionId, featureId, participantId, value } = data;

            // Verify participant is in the session
            const exists = await participantService.participantExistsInSession(
                participantId,
                sessionId
            );
            if (!exists) {
                socket.emit("error", { message: "Unauthorized" });
                return;
            }

            // Submit the vote
            await featureService.submitVote(featureId, participantId, value);

            // Notify all participants that someone voted (without revealing the value)
            this.io.to(sessionId).emit("vote-submitted", {
                featureId,
                participantId,
                hasVoted: true,
            });

            console.log(
                `[Socket] Vote submitted by ${participantId} for feature ${featureId}`
            );
        } catch (error) {
            console.error("[Socket] Error handling submit-vote:", error);
            socket.emit("error", { message: "Failed to submit vote" });
        }
    }

    /**
     * Handle starting a new feature (host only)
     */
    private async handleStartFeature(
        socket: Socket,
        data: { sessionId: string; participantId: string; name?: string; link?: string }
    ) {
        try {
            const { sessionId, participantId, name, link } = data;

            // Verify participant is the host
            const isHost = await sessionService.isHost(sessionId, participantId);
            if (!isHost) {
                socket.emit("error", { message: "Only the host can start features" });
                return;
            }

            // Create the feature
            const feature = await featureService.createFeature(sessionId, name, link);

            // Notify all participants
            this.io.to(sessionId).emit("feature-started", {
                feature,
            });

            console.log(`[Socket] Feature ${feature.id} started by host in session ${sessionId}`);
        } catch (error) {
            console.error("[Socket] Error handling start-feature:", error);
            socket.emit("error", { message: "Failed to start feature" });
        }
    }

    /**
     * Handle revealing results (host only)
     */
    private async handleRevealResults(
        socket: Socket,
        data: { sessionId: string; featureId: string; participantId: string }
    ) {
        try {
            const { sessionId, featureId, participantId } = data;

            // Verify participant is the host
            const isHost = await sessionService.isHost(sessionId, participantId);
            if (!isHost) {
                socket.emit("error", { message: "Only the host can reveal results" });
                return;
            }

            // Reveal the results
            const feature = await featureService.revealResults(featureId);
            const hasConsensus = await featureService.checkConsensus(featureId);

            // Notify all participants with the votes
            this.io.to(sessionId).emit("results-revealed", {
                feature,
                hasConsensus,
            });

            console.log(`[Socket] Results revealed for feature ${featureId} in session ${sessionId}`);
        } catch (error) {
            console.error("[Socket] Error handling reveal-results:", error);
            socket.emit("error", { message: "Failed to reveal results" });
        }
    }

    /**
     * Handle participant disconnect
     */
    private handleDisconnect(socket: Socket) {
        const socketData = socket.data as SocketData;
        const { sessionId, participantId } = socketData;

        if (sessionId && participantId) {
            console.log(`[Socket] Client ${socket.id} disconnected (participant ${participantId}, session ${sessionId})`);
            
            // Wait 3 seconds before treating this as a real disconnect
            // This allows for reconnection scenarios (page refresh, network hiccups)
            const timer = setTimeout(async () => {
                // Check if participant is the host
                const isHost = await sessionService.isHost(sessionId, participantId);
                
                if (isHost) {
                    // Host disconnected - notify all participants
                    this.io.to(sessionId).emit("host-disconnected", {});
                    console.log(`[Socket] Host ${participantId} disconnected from session ${sessionId} (grace period expired)`);
                } else {
                    // Regular participant left
                    this.io.to(sessionId).emit("participant-left", {
                        participantId,
                    });
                    console.log(
                        `[Socket] Participant ${participantId} disconnected from session ${sessionId} (grace period expired)`
                    );
                }

                // Remove from tracking
                this.participantSockets.delete(participantId);
                this.disconnectTimers.delete(participantId);
            }, 3000); // 3 second grace period

            // Store the timer so we can cancel it if they reconnect
            this.disconnectTimers.set(participantId, timer);
        } else {
            console.log(`[Socket] Client disconnected: ${socket.id} (no session data)`);
        }
    }
}

export default SocketHandler;
