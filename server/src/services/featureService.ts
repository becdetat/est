import prisma from "../config/database";
import { nanoid } from "nanoid";

/**
 * Service for managing features and voting
 */
export class FeatureService {
    /**
     * Create a new feature for estimation
     */
    async createFeature(sessionId: string, name: string | undefined, link: string | undefined) {
        const featureId = nanoid(21);

        try {
            const feature = await prisma.feature.create({
                data: {
                    id: featureId,
                    sessionId,
                    name,
                    link,
                    isRevealed: false,
                },
            });

            console.log(`[FeatureService] Created feature ${featureId} for session ${sessionId}`);
            return feature;
        } catch (error) {
            console.error("[FeatureService] Error creating feature:", error);
            throw error;
        }
    }

    /**
     * Get feature by ID
     */
    async getFeature(featureId: string) {
        try {
            return await prisma.feature.findUnique({
                where: { id: featureId },
                include: {
                    votes: {
                        include: {
                            participant: true,
                        },
                    },
                },
            });
        } catch (error) {
            console.error("[FeatureService] Error fetching feature:", error);
            throw error;
        }
    }

    /**
     * Get all features for a session
     */
    async getFeatures(sessionId: string) {
        try {
            return await prisma.feature.findMany({
                where: { sessionId },
                include: {
                    votes: {
                        include: {
                            participant: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            console.error("[FeatureService] Error fetching features:", error);
            throw error;
        }
    }

    /**
     * Get current (unrevealed) feature for a session
     */
    async getCurrentFeature(sessionId: string) {
        try {
            return await prisma.feature.findFirst({
                where: {
                    sessionId,
                    isRevealed: false,
                },
                include: {
                    votes: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            console.error("[FeatureService] Error fetching current feature:", error);
            throw error;
        }
    }

    /**
     * Submit or update a vote
     */
    async submitVote(featureId: string, participantId: string, value: string) {
        try {
            // Use upsert to create or update the vote
            const vote = await prisma.vote.upsert({
                where: {
                    featureId_participantId: {
                        featureId,
                        participantId,
                    },
                },
                update: {
                    value,
                },
                create: {
                    id: nanoid(21),
                    featureId,
                    participantId,
                    value,
                },
            });

            console.log(
                `[FeatureService] Vote submitted: ${participantId} voted ${value} on feature ${featureId}`
            );
            return vote;
        } catch (error) {
            console.error("[FeatureService] Error submitting vote:", error);
            throw error;
        }
    }

    /**
     * Get all votes for a feature
     */
    async getVotes(featureId: string) {
        try {
            return await prisma.vote.findMany({
                where: { featureId },
                include: {
                    participant: true,
                },
            });
        } catch (error) {
            console.error("[FeatureService] Error fetching votes:", error);
            throw error;
        }
    }

    /**
     * Reveal results for a feature
     */
    async revealResults(featureId: string) {
        try {
            const feature = await prisma.feature.update({
                where: { id: featureId },
                data: { isRevealed: true },
                include: {
                    votes: {
                        include: {
                            participant: true,
                        },
                    },
                },
            });

            console.log(`[FeatureService] Revealed results for feature ${featureId}`);
            return feature;
        } catch (error) {
            console.error("[FeatureService] Error revealing results:", error);
            throw error;
        }
    }

    /**
     * Check if all votes are the same (for wobble animation)
     */
    async checkConsensus(featureId: string): Promise<boolean> {
        try {
            const votes = await prisma.vote.findMany({
                where: { featureId },
            });

            if (votes.length === 0) {
                return false;
            }

            const firstValue = votes[0].value;
            return votes.every((vote) => vote.value === firstValue);
        } catch (error) {
            console.error("[FeatureService] Error checking consensus:", error);
            return false;
        }
    }
}

export default new FeatureService();
