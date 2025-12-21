import { Box } from "@mui/material";
import { ParticipantCard } from "./ParticipantCard";
import type { Participant } from "../../types";

interface ParticipantCardGridProps {
    participants: Participant[];
    currentParticipantId?: string;
    votes?: Record<string, string>;
    isRevealed: boolean;
}

/**
 * Responsive grid of participant cards showing voting status
 */
export function ParticipantCardGrid({
    participants,
    currentParticipantId,
    votes = {},
    isRevealed,
}: ParticipantCardGridProps) {
    // Calculate consensus value if revealed
    const consensusValue = isRevealed ? calculateConsensus(votes) : undefined;

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr", // Stack on mobile
                    sm: "repeat(2, 1fr)", // 2 columns on small tablets
                    md: "repeat(3, 1fr)", // 3 columns on medium screens
                    lg: "repeat(4, 1fr)", // 4 columns on large screens
                },
                gap: 3,
                justifyItems: "center",
                mb: 4,
            }}
        >
            {participants.map((participant) => {
                const hasVoted = !!votes[participant.id];
                const voteValue = votes[participant.id];
                const isCurrentUser = participant.id === currentParticipantId;

                return (
                    <ParticipantCard
                        key={participant.id}
                        participant={participant}
                        hasVoted={hasVoted}
                        isRevealed={isRevealed}
                        voteValue={voteValue}
                        isCurrentUser={isCurrentUser}
                        consensusValue={consensusValue}
                    />
                );
            })}
        </Box>
    );
}

/**
 * Calculate if there's consensus among votes
 * Returns the consensus value if all votes match, undefined otherwise
 */
function calculateConsensus(votes: Record<string, string>): string | undefined {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return undefined;
    
    // Ignore special votes (?, ☕) in consensus calculation
    const validVotes = voteValues.filter(v => v !== "?" && v !== "☕");
    if (validVotes.length === 0) return undefined;
    
    const firstVote = validVotes[0];
    const hasConsensus = validVotes.every(v => v === firstVote);
    
    return hasConsensus ? firstVote : undefined;
}
