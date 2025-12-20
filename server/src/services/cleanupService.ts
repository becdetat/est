import prisma from "../config/database";

/**
 * Cleanup service for managing database maintenance tasks
 */
export class CleanupService {
    /**
     * Delete sessions that are older than the specified number of days
     * @param daysOld - Number of days to consider a session old (default: 28)
     * @returns Number of sessions deleted
     */
    async deleteOldSessions(daysOld: number = 28): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        try {
            // Delete sessions older than the cutoff date
            // Cascade delete will automatically remove associated participants, features, and votes
            const result = await prisma.session.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            });

            console.log(`[CleanupService] Deleted ${result.count} sessions older than ${daysOld} days`);
            return result.count;
        } catch (error) {
            console.error("[CleanupService] Error deleting old sessions:", error);
            throw error;
        }
    }

    /**
     * Get count of sessions older than specified days
     * @param daysOld - Number of days to consider a session old (default: 28)
     * @returns Number of old sessions
     */
    async getOldSessionsCount(daysOld: number = 28): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        try {
            const count = await prisma.session.count({
                where: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            });

            return count;
        } catch (error) {
            console.error("[CleanupService] Error counting old sessions:", error);
            throw error;
        }
    }

    /**
     * Delete a specific session by ID
     * @param sessionId - Session ID to delete
     * @returns True if deleted, false if not found
     */
    async deleteSession(sessionId: string): Promise<boolean> {
        try {
            await prisma.session.delete({
                where: {
                    id: sessionId,
                },
            });

            console.log(`[CleanupService] Deleted session: ${sessionId}`);
            return true;
        } catch (error) {
            if ((error as any).code === "P2025") {
                // Record not found
                return false;
            }
            console.error("[CleanupService] Error deleting session:", error);
            throw error;
        }
    }

    /**
     * Check if a session exists and is not older than 28 days
     * @param sessionId - Session ID to check
     * @returns True if session exists and is valid, false otherwise
     */
    async isSessionValid(sessionId: string): Promise<boolean> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 28);

        try {
            const session = await prisma.session.findFirst({
                where: {
                    id: sessionId,
                    createdAt: {
                        gte: cutoffDate,
                    },
                },
            });

            return session !== null;
        } catch (error) {
            console.error("[CleanupService] Error checking session validity:", error);
            return false;
        }
    }
}

export default new CleanupService();
