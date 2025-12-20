import { Router } from "express";
import sessionController from "../controllers/sessionController";

const router = Router();

// Session routes
router.post("/sessions", (req, res) => sessionController.createSession(req, res));
router.get("/sessions/:sessionId", (req, res) => sessionController.getSession(req, res));
router.post("/sessions/:sessionId/participants", (req, res) =>
    sessionController.joinSession(req, res)
);

// Feature routes
router.get("/sessions/:sessionId/features", (req, res) =>
    sessionController.getFeatures(req, res)
);
router.post("/sessions/:sessionId/features", (req, res) =>
    sessionController.createFeature(req, res)
);
router.post("/sessions/:sessionId/features/:featureId/reveal", (req, res) =>
    sessionController.revealResults(req, res)
);

export default router;
