import { Request, Response } from "express";
import sessionService from "../services/sessionService";
import participantService from "../services/participantService";
import featureService from "../services/featureService";
import cleanupService from "../services/cleanupService";

/**
 * Controller for session-related endpoints
 */
export class SessionController {
    /**
     * POST /api/sessions
     * Create a new estimation session
     */
    async createSession(req: Request, res: Response): Promise<any> {
        try {
            const { hostName, hostEmail, estimationType } = req.body;

            // Validate required fields
            if (!hostName || !estimationType) {
                return res.status(400).json({
                    error: "Missing required fields: hostName and estimationType",
                });
            }

            // Validate estimation type
            if (estimationType !== "FIBONACCI" && estimationType !== "TSHIRT") {
                return res.status(400).json({
                    error: "Invalid estimationType. Must be FIBONACCI or TSHIRT",
                });
            }

            const result = await sessionService.createSession(hostName, hostEmail, estimationType);

            res.status(201).json({
                sessionId: result.sessionId,
                hostParticipantId: result.hostParticipantId,
            });
        } catch (error) {
            console.error("[SessionController] Error creating session:", error);
            res.status(500).json({ error: "Failed to create session" });
        }
    }

    /**
     * GET /api/sessions/:sessionId
     * Get session details including participants and features
     */
    async getSession(req: Request, res: Response): Promise<any> {
        try {
            const { sessionId } = req.params;

            // Check if session is valid (exists and not expired)
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                return res.status(404).json({ error: "Session not found or expired" });
            }

            const result = await sessionService.getSession(sessionId);

            if (!result) {
                return res.status(404).json({ error: "Session not found" });
            }

            res.json(result);
        } catch (error) {
            console.error("[SessionController] Error fetching session:", error);
            res.status(500).json({ error: "Failed to fetch session" });
        }
    }

    /**
     * POST /api/sessions/:sessionId/participants
     * Add a participant to a session
     */
    async joinSession(req: Request, res: Response): Promise<any> {
        try {
            const { sessionId } = req.params;
            const { participantId, name, email } = req.body;

            // Validate required fields
            if (!participantId || !name) {
                return res.status(400).json({
                    error: "Missing required fields: participantId and name",
                });
            }

            // Check if session is valid
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                return res.status(404).json({ error: "Session not found or expired" });
            }

            const participant = await participantService.joinSession(
                sessionId,
                participantId,
                name,
                email
            );

            res.status(201).json(participant);
        } catch (error) {
            console.error("[SessionController] Error joining session:", error);
            res.status(500).json({ error: "Failed to join session" });
        }
    }

    /**
     * GET /api/sessions/:sessionId/features
     * Get all features with votes for a session
     */
    async getFeatures(req: Request, res: Response): Promise<any> {
        try {
            const { sessionId } = req.params;

            // Check if session is valid
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                return res.status(404).json({ error: "Session not found or expired" });
            }

            const features = await featureService.getFeatures(sessionId);
            res.json(features);
        } catch (error) {
            console.error("[SessionController] Error fetching features:", error);
            res.status(500).json({ error: "Failed to fetch features" });
        }
    }

    /**
     * POST /api/sessions/:sessionId/features
     * Create a new feature for estimation (host only)
     */
    async createFeature(req: Request, res: Response): Promise<any> {
        try {
            const { sessionId } = req.params;
            const { participantId, name, link } = req.body;

            // Validate required fields
            if (!participantId) {
                return res.status(400).json({ error: "Missing required field: participantId" });
            }

            // Check if session is valid
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                return res.status(404).json({ error: "Session not found or expired" });
            }

            // Verify participant is the host
            const isHost = await sessionService.isHost(sessionId, participantId);
            if (!isHost) {
                return res.status(403).json({ error: "Only the host can create features" });
            }

            const feature = await featureService.createFeature(sessionId, name, link);
            res.status(201).json(feature);
        } catch (error) {
            console.error("[SessionController] Error creating feature:", error);
            res.status(500).json({ error: "Failed to create feature" });
        }
    }

    /**
     * POST /api/sessions/:sessionId/features/:featureId/reveal
     * Reveal results for a feature (host only)
     */
    async revealResults(req: Request, res: Response): Promise<any> {
        try {
            const { sessionId, featureId } = req.params;
            const { participantId } = req.body;

            // Validate required fields
            if (!participantId) {
                return res.status(400).json({ error: "Missing required field: participantId" });
            }

            // Check if session is valid
            const isValid = await cleanupService.isSessionValid(sessionId);
            if (!isValid) {
                return res.status(404).json({ error: "Session not found or expired" });
            }

            // Verify participant is the host
            const isHost = await sessionService.isHost(sessionId, participantId);
            if (!isHost) {
                return res.status(403).json({ error: "Only the host can reveal results" });
            }

            const feature = await featureService.revealResults(featureId);
            const hasConsensus = await featureService.checkConsensus(featureId);

            res.json({
                feature,
                hasConsensus,
            });
        } catch (error) {
            console.error("[SessionController] Error revealing results:", error);
            res.status(500).json({ error: "Failed to reveal results" });
        }
    }
}

export default new SessionController();
