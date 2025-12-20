import prisma from "../config/database";

/**
 * Service for managing participants in estimation sessions
 */
export class ParticipantService {
    /**
     * Add a participant to a session
     */
    async joinSession(
        sessionId: string,
        participantId: string,
        name: string,
        email: string | undefined
    ) {
        try {
            // Check if participant already exists
            const existingParticipant = await prisma.participant.findUnique({
                where: { id: participantId },
            });

            if (existingParticipant) {
                console.log(`[ParticipantService] Participant ${participantId} already exists`);
                return existingParticipant;
            }

            // Create new participant
            const participant = await prisma.participant.create({
                data: {
                    id: participantId,
                    sessionId,
                    name,
                    email,
                    isHost: false,
                },
            });

            console.log(`[ParticipantService] Participant ${name} joined session ${sessionId}`);
            return participant;
        } catch (error) {
            console.error("[ParticipantService] Error joining session:", error);
            throw error;
        }
    }

    /**
     * Get participant by ID
     */
    async getParticipant(participantId: string) {
        try {
            return await prisma.participant.findUnique({
                where: { id: participantId },
            });
        } catch (error) {
            console.error("[ParticipantService] Error fetching participant:", error);
            throw error;
        }
    }

    /**
     * Check if a participant exists in a session
     */
    async participantExistsInSession(
        participantId: string,
        sessionId: string
    ): Promise<boolean> {
        try {
            const participant = await prisma.participant.findFirst({
                where: {
                    id: participantId,
                    sessionId,
                },
            });

            return participant !== null;
        } catch (error) {
            console.error("[ParticipantService] Error checking participant existence:", error);
            return false;
        }
    }

    /**
     * Remove a participant from a session
     */
    async removeParticipant(participantId: string) {
        try {
            await prisma.participant.delete({
                where: { id: participantId },
            });

            console.log(`[ParticipantService] Removed participant ${participantId}`);
            return true;
        } catch (error) {
            if ((error as any).code === "P2025") {
                // Record not found
                return false;
            }
            console.error("[ParticipantService] Error removing participant:", error);
            throw error;
        }
    }
}

export default new ParticipantService();
