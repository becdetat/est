import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
} from "@mui/material";
import { createSession } from "../../services/apiService";
import { useParticipant } from "../../hooks";

/**
 * Home page for creating a new estimation session
 */
export function Home() {
    const navigate = useNavigate();
    const { participant, updateParticipant } = useParticipant();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(participant?.name || "");
    const [email, setEmail] = useState(participant?.email || "");
    const [estimationType, setEstimationType] = useState<"FIBONACCI" | "TSHIRT">(
        "FIBONACCI"
    );

    const handleOpen = () => {
        setOpen(true);
        setError(null);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create session
            const response = await createSession(
                name.trim(),
                estimationType,
                email.trim() || undefined
            );

            // Update participant with the host participant ID from server
            updateParticipant(name.trim(), email.trim() || undefined, response.hostParticipantId);

            // Navigate to session
            navigate(`/session/${response.sessionId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        maxWidth: 500,
                        width: "100%",
                    }}
                >
                    <Typography variant="h2" component="h1" gutterBottom>
                        Est
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Planning Poker for Teams
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Create a session and invite your team to estimate features
                        together in real-time.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleOpen}
                        fullWidth
                    >
                        Create New Session
                    </Button>
                </Paper>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!error && !name.trim()}
                        helperText={error && !name.trim() ? "Name is required" : ""}
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
                        sx={{ mb: 3 }}
                    />
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Estimation Type</FormLabel>
                        <RadioGroup
                            value={estimationType}
                            onChange={(e) =>
                                setEstimationType(e.target.value as "FIBONACCI" | "TSHIRT")
                            }
                        >
                            <FormControlLabel
                                value="FIBONACCI"
                                control={<Radio />}
                                label="Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, ?, ☕)"
                            />
                            <FormControlLabel
                                value="TSHIRT"
                                control={<Radio />}
                                label="T-Shirt Sizes (XS, S, M, L, XL, XXL, ?, ☕)"
                            />
                        </RadioGroup>
                    </FormControl>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Creating..." : "Create Session"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
