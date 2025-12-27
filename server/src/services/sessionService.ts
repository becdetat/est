import prisma from "../config/database";
import { nanoid } from "nanoid";

/**
 * Service for managing estimation sessions
 */
export class SessionService {
    /**
     * Create a new estimation session
     */
    async createSession(
        hostName: string,
        hostEmail: string | undefined,
        estimationType: "FIBONACCI" | "TSHIRT"
    ) {
        const sessionId = nanoid(21); // Generate unique session ID
        const hostParticipantId = nanoid(21); // Generate unique participant ID

        try {
            // Create session with host participant in a transaction
            const session = await prisma.session.create({
                data: {
                    id: sessionId,
                    estimationType,
                    participants: {
                        create: {
                            id: hostParticipantId,
                            name: hostName,
                            email: hostEmail,
                            isHost: true,
                        },
                    },
                },
                include: {
                    participants: true,
                },
            });

            console.log(`[SessionService] Created session ${sessionId} with host ${hostName}`);

            return {
                sessionId: session.id,
                hostParticipantId,
                session,
            };
        } catch (error) {
            console.error("[SessionService] Error creating session:", error);
            throw error;
        }
    }

    /**
     * Get session by ID with all related data
     */
    async getSession(sessionId: string) {
        try {
            const session = await prisma.session.findUnique({
                where: { id: sessionId },
                include: {
                    participants: true,
                    features: {
                        include: {
                            votes: true,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });

            if (!session) {
                return null;
            }

            // Get the current (latest unrevealed) feature
            const currentFeature = session.features.find((f) => !f.isRevealed);

            return {
                session,
                currentFeature,
            };
        } catch (error) {
            console.error("[SessionService] Error fetching session:", error);
            throw error;
        }
    }

    /**
     * Check if a participant is the host of a session
     */
    async isHost(sessionId: string, participantId: string): Promise<boolean> {
        try {
            const participant = await prisma.participant.findFirst({
                where: {
                    id: participantId,
                    sessionId: sessionId,
                    isHost: true,
                },
            });

            return participant !== null;
        } catch (error) {
            console.error("[SessionService] Error checking host status:", error);
            return false;
        }
    }

    /**
     * Get all participants in a session
     */
    async getParticipants(sessionId: string) {
        try {
            return await prisma.participant.findMany({
                where: { sessionId },
                orderBy: {
                    createdAt: "asc",
                },
            });
        } catch (error) {
            console.error("[SessionService] Error fetching participants:", error);
            throw error;
        }
    }

    /**
     * Delete a session (close it)
     */
    async deleteSession(sessionId: string) {
        try {
            await prisma.session.delete({
                where: { id: sessionId },
            });

            console.log(`[SessionService] Deleted session ${sessionId}`);
            return true;
        } catch (error) {
            console.error("[SessionService] Error deleting session:", error);
            throw error;
        }
    }
}

export default new SessionService();
