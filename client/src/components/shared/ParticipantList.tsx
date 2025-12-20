import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { UserAvatar } from "./UserAvatar";
import type { Participant } from "../../types";

interface ParticipantListProps {
    participants: Participant[];
    currentParticipantId?: string;
    votes?: Record<string, string>;
}

/**
 * List of participants in a session
 */
export function ParticipantList({
    participants,
    currentParticipantId,
    votes = {},
}: ParticipantListProps) {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Participants ({participants.length})
            </Typography>
            <List>
                {participants.map((participant) => {
                    const hasVoted = !!votes[participant.id];
                    const isCurrentUser = participant.id === currentParticipantId;

                    return (
                        <ListItem key={participant.id}>
                            <ListItemAvatar>
                                <UserAvatar
                                    name={participant.name}
                                    email={participant.email}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span>{participant.name}</span>
                                        {participant.isHost && (
                                            <Chip label="Host" size="small" color="primary" />
                                        )}
                                        {isCurrentUser && (
                                            <Chip label="You" size="small" variant="outlined" />
                                        )}
                                    </Box>
                                }
                                secondary={participant.email}
                            />
                            {hasVoted && (
                                <Chip
                                    label="Voted"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}
