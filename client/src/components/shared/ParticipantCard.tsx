import { Card, CardContent, Typography, Box } from "@mui/material";
import { UserAvatar } from "./UserAvatar";
import { useState, useEffect } from "react";
import type { Participant } from "../../types";

interface ParticipantCardProps {
    participant: Participant;
    hasVoted: boolean;
    isRevealed: boolean;
    voteValue?: string;
    isCurrentUser: boolean;
    consensusValue?: string;
}

/**
 * Individual participant card with playing card display
 */
export function ParticipantCard({
    participant,
    hasVoted,
    isRevealed,
    voteValue,
    isCurrentUser,
    consensusValue,
}: ParticipantCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const hasConsensus = consensusValue && voteValue === consensusValue;

    // Handle flip animation when results are revealed
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (isRevealed && hasVoted) {
            // Start flip animation
            setIsFlipped(true);
            
            // If consensus, shake after flip completes
            if (hasConsensus) {
                const shakeTimer = setTimeout(() => {
                    setShouldShake(true);
                    // Stop shake after animation
                    const stopShakeTimer = setTimeout(() => {
                        setShouldShake(false);
                    }, 600);
                    return () => clearTimeout(stopShakeTimer);
                }, 500); // Wait for flip to complete
                return () => clearTimeout(shakeTimer);
            }
        } else {
            setIsFlipped(false);
            setShouldShake(false);
        }
    }, [isRevealed, hasVoted, hasConsensus]);
    /* eslint-enable react-hooks/set-state-in-effect */

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 200,
                minWidth: 150,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s",
            }}
        >
            <CardContent sx={{ textAlign: "center", pb: 2 }}>
                {/* Avatar and name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <UserAvatar
                        name={participant.name}
                        email={participant.email}
                        size={32}
                    />
                    <Box sx={{ flex: 1, textAlign: "left" }}>
                        <Typography 
                            variant="body2" 
                            fontWeight={isCurrentUser ? "bold" : "normal"} 
                            noWrap
                        >
                            {participant.name} 
                            {participant.isHost && " (Host)"}
                            {isCurrentUser && " (You)"}
                        </Typography>
                    </Box>
                </Box>

                {/* Playing card */}
                <Box
                    sx={{
                        perspective: "1000px",
                        width: "100%",
                        height: 140,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            transition: "transform 0.5s",
                            animation: shouldShake ? "shake 0.6s" : "none",
                            "@keyframes shake": {
                                "0%, 100%": { transform: isFlipped ? "rotateY(180deg) translateX(0)" : "translateX(0)" },
                                "10%, 30%, 50%, 70%, 90%": { 
                                    transform: isFlipped ? "rotateY(180deg) translateX(-5px)" : "translateX(-5px)" 
                                },
                                "20%, 40%, 60%, 80%": { 
                                    transform: isFlipped ? "rotateY(180deg) translateX(5px)" : "translateX(5px)" 
                                },
                            },
                        }}
                    >
                        {/* Card Back */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                bgcolor: hasVoted ? "background.paper" : "grey.100",
                                boxShadow: hasVoted ? "0 0 12px rgba(25, 118, 210, 0.5)" : "none",
                                background: hasVoted
                                    ? "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)"
                                    : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
                                overflow: "hidden",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `
                                        repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 10px,
                                            rgba(0,0,0,0.03) 10px,
                                            rgba(0,0,0,0.03) 20px
                                        )
                                    `,
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "serif",
                                    fontStyle: "italic",
                                    fontSize: "1.5rem",
                                    color: "text.secondary",
                                    opacity: 0.6,
                                    zIndex: 1,
                                }}
                            >
                                Est.
                            </Typography>
                        </Box>

                        {/* Card Front (Revealed) */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                border: "2px solid",
                                borderColor: hasConsensus ? "success.main" : "divider",
                                borderRadius: 2,
                                bgcolor: hasConsensus ? "success.light" : "background.paper",
                                boxShadow: hasConsensus ? "0 0 16px rgba(46, 125, 50, 0.6)" : "none",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.3s",
                            }}
                        >
                            {/* Top left corner */}
                            <Box sx={{ position: "absolute", top: 8, left: 8, textAlign: "left" }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color={hasConsensus ? "success.dark" : "text.primary"}
                                    sx={{ lineHeight: 1 }}
                                >
                                    {voteValue || "?"}
                                </Typography>
                            </Box>

                            {/* Center value */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color={hasConsensus ? "success.dark" : "primary.main"}
                                >
                                    {voteValue || "?"}
                                </Typography>
                            </Box>

                            {/* Bottom right corner (upside down) */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 8,
                                    textAlign: "right",
                                    transform: "rotate(180deg)",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color={hasConsensus ? "success.dark" : "text.primary"}
                                    sx={{ lineHeight: 1 }}
                                >
                                    {voteValue || "?"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
