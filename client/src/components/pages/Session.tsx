import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    CircularProgress,
    Alert,
    AppBar,
    Toolbar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import { useSession, useParticipant, useSocket } from "../../hooks";
import { joinSession } from "../../services/apiService";
import {
    VotingCardGrid,
    ParticipantList,
    ParticipantCardGrid,
    FeatureFormDialog,
    FeatureHistorySidebar,
} from "../shared";
import type { SessionData, Participant } from "../../types";

/**
 * Session page for voting on features
 */
export function Session() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const { participant, updateParticipant } = useParticipant();
    const { isConnected, on, off, joinSession: socketJoinSession, submitVote, unsubmitVote, startFeature: socketStartFeature, revealResults: socketRevealResults, closeSession: socketCloseSession } = useSocket();
    const { session, features, participants, loading: sessionLoading, error: sessionError, addParticipant: addParticipantToState, removeParticipant: removeParticipantFromState, setFeatures } = useSession(sessionId);

    const [joined, setJoined] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [name, setName] = useState(participant?.name || "");
    const [email, setEmail] = useState(participant?.email || "");
    const [joinError, setJoinError] = useState<string | null>(null);
    const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedVote, setSelectedVote] = useState<string | undefined>(undefined);

    // Get the most recent feature (unrevealed if available, otherwise most recent revealed)
    const currentFeature = features.length > 0 
        ? (features.find((f) => !f.isRevealed) || features[features.length - 1])
        : undefined;
    const isHost = participant && participants.some(
        (p) => p.id === participant.id && p.isHost
    );

    // Check if current participant already exists in the session
    const participantExists = participant && participants.some(
        (p) => p.id === participant.id
    );

    useEffect(() => {
        if (!participant) {
            setJoinDialogOpen(true);
        } else if (sessionId && isConnected && !joined && !participantExists) {
            handleJoin();
        } else if (participantExists && !joined) {
            // Participant already exists in session, just connect socket
            socketJoinSession(sessionId!, participant.id);
            setJoined(true);
            setJoinDialogOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, participant, isConnected, participantExists]);

    // Socket.IO event handlers
    useEffect(() => {
        if (!isConnected) return;

        const handleSessionJoined = (data: SessionData) => {
            console.log("[Session] Joined:", data);
        };

        const handleVoteSubmitted = (data: {
            featureId: string;
            participantId: string;
            value: string;
        }) => {
            console.log("[Session] Vote submitted:", data);
            // Use callback form to get current features
            setFeatures((currentFeatures) => {
                const feature = currentFeatures.find(f => f.id === data.featureId);
                if (!feature) return currentFeatures;
                
                const updatedFeature = {
                    ...feature,
                    votes: [
                        ...(feature.votes || []).filter(v => v.participantId !== data.participantId),
                        { id: '', featureId: data.featureId, participantId: data.participantId, value: data.value || '?', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
                    ]
                };
                return currentFeatures.map(f => f.id === updatedFeature.id ? updatedFeature : f);
            });
        };

        const handleVoteUnsubmitted = (data: {
            featureId: string;
            participantId: string;
        }) => {
            // If this is the current participant's vote being removed, clear selectedVote
            if (participant && data.participantId === participant.id) {
                setSelectedVote(undefined);
            }
            
            // Use callback form to get current features
            setFeatures((currentFeatures) => {
                const feature = currentFeatures.find(f => f.id === data.featureId);
                if (!feature) return currentFeatures;
                
                const updatedFeature = {
                    ...feature,
                    votes: (feature.votes || []).filter(v => v.participantId !== data.participantId)
                };
                return currentFeatures.map(f => f.id === updatedFeature.id ? updatedFeature : f);
            });
        };

        const handleFeatureStarted = (data: { feature: any }) => {
            console.log("[Session] Feature started:", data);
            if (data.feature) {
                setFeatures((prev) => [...prev, data.feature]);
            }
            setSelectedVote(undefined);
        };

        const handleResultsRevealed = (data: { feature: any; hasConsensus: boolean }) => {
            console.log("[Session] Results revealed:", data);
            if (data.feature) {
                setFeatures((prev) => prev.map((f) => (f.id === data.feature.id ? data.feature : f)));
            }
            setSelectedVote(undefined);
        };

        const handleParticipantJoined = (newParticipant: Participant) => {
            console.log("[Session] Participant joined:", newParticipant);
            addParticipantToState(newParticipant);
        };

        const handleParticipantLeft = (participantId: string) => {
            console.log("[Session] Participant left:", participantId);
            removeParticipantFromState(participantId);
        };

        const handleSessionClosed = (data: { sessionId: string }) => {
            console.log("[Session] Session closed event received:", data);
            console.log("[Session] Redirecting to home page...");
            // Redirect to home page
            navigate("/");
        };

        on("session-joined", handleSessionJoined);
        on("vote-submitted", handleVoteSubmitted);
        on("vote-unsubmitted", handleVoteUnsubmitted);
        on("feature-started", handleFeatureStarted);
        on("results-revealed", handleResultsRevealed);
        on("participant-joined", handleParticipantJoined);
        on("participant-left", handleParticipantLeft);
        on("session-closed", handleSessionClosed);

        return () => {
            off("session-joined", handleSessionJoined);
            off("vote-submitted", handleVoteSubmitted);
            off("vote-unsubmitted", handleVoteUnsubmitted);
            off("feature-started", handleFeatureStarted);
            off("results-revealed", handleResultsRevealed);
            off("participant-joined", handleParticipantJoined);
            off("participant-left", handleParticipantLeft);
            off("session-closed", handleSessionClosed);
        };
    }, [isConnected, on, off, setFeatures, addParticipantToState, removeParticipantFromState, navigate]);

    const handleJoin = async () => {
        if (!sessionId || !participant) return;

        try {
            await joinSession(sessionId, participant.id, participant.name, participant.email);
            socketJoinSession(sessionId, participant.id);
            setJoined(true);
            setJoinDialogOpen(false);
        } catch (err) {
            setJoinError(err instanceof Error ? err.message : "Failed to join session");
        }
    };

    const handleJoinSubmit = async () => {
        if (!name.trim() || !sessionId) {
            setJoinError("Name is required");
            return;
        }

        try {
            setJoinError(null);
            updateParticipant(name.trim(), email.trim() || undefined);
            // Will trigger join via useEffect
        } catch (err) {
            setJoinError(err instanceof Error ? err.message : "Failed to join session");
        }
    };

    const handleVote = (value: string) => {
        if (!sessionId || !currentFeature || !participant) return;
        
        // If clicking the same card, deselect it
        if (selectedVote === value) {
            setSelectedVote(undefined);
            unsubmitVote(sessionId, currentFeature.id, participant.id);
        } else {
            setSelectedVote(value);
            submitVote(sessionId, currentFeature.id, participant.id, value);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            alert("Session link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleStartFeature = (name: string, link?: string) => {
        if (!sessionId || !participant) return;
        socketStartFeature(sessionId, participant.id, name, link);
        setFeatureDialogOpen(false);
    };

    const handleRevealResults = () => {
        if (!currentFeature || !sessionId || !participant) return;
        socketRevealResults(sessionId, currentFeature.id, participant.id);
    };

    const handleCloseSession = () => {
        if (!sessionId || !participant) return;
        if (confirm("Are you sure you want to close this session? All participants will be disconnected.")) {
            console.log("[Session] Host closing session:", sessionId);
            socketCloseSession(sessionId, participant.id);
            // Redirect host immediately after closing
            setTimeout(() => navigate("/"), 100);
        }
    };

    if (sessionLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (sessionError) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{sessionError}</Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Go Home
                </Button>
            </Container>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Est.
                    </Typography>
                    <IconButton color="inherit" onClick={handleShare}>
                        <ShareIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setHistoryOpen(true)}>
                        <HistoryIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {!isConnected && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Connecting to server...
                    </Alert>
                )}

                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        {currentFeature ? (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h5" gutterBottom>
                                    {currentFeature.name || "Current Feature"}
                                </Typography>
                                {currentFeature.link && (
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        component="a"
                                        href={currentFeature.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {currentFeature.link}
                                    </Typography>
                                )}
                            </Paper>
                        ) : (
                            <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
                                <Typography variant="h6" color="text.secondary">
                                    No active feature
                                </Typography>
                                {isHost && (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setFeatureDialogOpen(true)}
                                        sx={{ mt: 2 }}
                                    >
                                        Start Feature
                                    </Button>
                                )}
                            </Paper>
                        )}

                        {currentFeature && session && (
                            <>
                                {/* Participant Cards Grid */}
                                <ParticipantCardGrid
                                    participants={participants}
                                    currentParticipantId={participant?.id}
                                    votes={
                                        currentFeature.votes
                                            ? Object.fromEntries(
                                                currentFeature.votes.map((v) => [v.participantId, v.value])
                                            )
                                            : {}
                                    }
                                    isRevealed={currentFeature.isRevealed}
                                />

                                <Typography variant="h6" gutterBottom>
                                    Select Your Estimate
                                </Typography>
                                <VotingCardGrid
                                    estimationType={session.estimationType}
                                    selectedValue={selectedVote}
                                    disabled={currentFeature.isRevealed}
                                    onSelectCard={handleVote}
                                />

                                {currentFeature.isRevealed && currentFeature.votes && currentFeature.votes.length > 0 && (
                                    <Paper sx={{ p: 3, mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Results
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            {currentFeature.votes.map((vote) => {
                                                const voter = participants.find(p => p.id === vote.participantId);
                                                return (
                                                    <Box key={vote.id} sx={{ textAlign: "center" }}>
                                                        <Typography variant="h4" color="primary">
                                                            {vote.value}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {voter?.name || "Unknown"}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Paper>
                                )}

                                {isHost && (
                                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleRevealResults}
                                            disabled={currentFeature.isRevealed}
                                        >
                                            Reveal Results
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => setFeatureDialogOpen(true)}
                                        >
                                            Next Feature
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>

                    <Box sx={{ width: 300 }}>
                        <ParticipantList
                            participants={participants}
                            currentParticipantId={participant?.id}
                        />
                        {isHost && (
                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={handleCloseSession}
                                sx={{ mt: 2 }}
                            >
                                Close Session
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>

            <Dialog open={joinDialogOpen} maxWidth="sm" fullWidth>
                <DialogTitle>Join Session</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!joinError && !name.trim()}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Your Email (optional)"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        helperText="Used for Gravatar avatar"
                    />
                    {joinError && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {joinError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Cancel</Button>
                    <Button
                        onClick={handleJoinSubmit}
                        variant="contained"
                        disabled={!name.trim()}
                    >
                        Join Session
                    </Button>
                </DialogActions>
            </Dialog>

            <FeatureFormDialog
                open={featureDialogOpen}
                onClose={() => setFeatureDialogOpen(false)}
                onSubmit={handleStartFeature}
            />

            <FeatureHistorySidebar
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                features={features}
                currentFeatureId={currentFeature?.id}
            />
        </>
    );
}
