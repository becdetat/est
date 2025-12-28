import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

class SocketService {
    private socket: Socket | null = null;

    /**
     * Connect to Socket.IO server
     */
    connect(): Socket {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            this.socket.on("connect", () => {
                console.log("[Socket] Connected:", this.socket?.id);
            });

            this.socket.on("disconnect", () => {
                console.log("[Socket] Disconnected");
            });

            this.socket.on("connect_error", (error) => {
                console.error("[Socket] Connection error:", error);
            });
        }

        return this.socket;
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Get current socket instance
     */
    getSocket(): Socket | null {
        return this.socket;
    }

    /**
     * Join a session room
     */
    joinSession(sessionId: string, participantId: string): void {
        if (this.socket) {
            this.socket.emit("join-session", { sessionId, participantId });
        }
    }

    /**
     * Submit or update a vote
     */
    submitVote(
        sessionId: string,
        featureId: string,
        participantId: string,
        value: string
    ): void {
        if (this.socket) {
            this.socket.emit("submit-vote", {
                sessionId,
                featureId,
                participantId,
                value,
            });
        }
    }

    /**
     * Remove a vote (deselect)
     */
    unsubmitVote(
        sessionId: string,
        featureId: string,
        participantId: string
    ): void {
        if (this.socket) {
            this.socket.emit("unsubmit-vote", {
                sessionId,
                featureId,
                participantId,
            });
        }
    }

    /**
     * Start a new feature (host only)
     */
    startFeature(
        sessionId: string,
        participantId: string,
        name?: string,
        link?: string
    ): void {
        if (this.socket) {
            this.socket.emit("start-feature", {
                sessionId,
                participantId,
                name,
                link,
            });
        }
    }

    /**
     * Reveal results (host only)
     */
    revealResults(sessionId: string, featureId: string, participantId: string): void {
        if (this.socket) {
            this.socket.emit("reveal-results", {
                sessionId,
                featureId,
                participantId,
            });
        }
    }

    /**
     * Close a session (host only)
     */
    closeSession(sessionId: string, participantId: string): void {
        if (this.socket) {
            this.socket.emit("close-session", {
                sessionId,
                participantId,
            });
        }
    }
}

export default new SocketService();
