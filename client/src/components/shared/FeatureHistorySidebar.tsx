import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Feature } from "../../types";

interface FeatureHistorySidebarProps {
    open: boolean;
    onClose: () => void;
    features: Feature[];
    currentFeatureId?: string;
    onSelectFeature?: (featureId: string) => void;
}

/**
 * Sidebar showing feature history
 */
export function FeatureHistorySidebar({
    open,
    onClose,
    features,
    currentFeatureId,
    onSelectFeature,
}: FeatureHistorySidebarProps) {
    const sortedFeatures = [...features].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 320, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Feature History
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {sortedFeatures.length === 0 ? (
                    <Typography color="text.secondary">No features yet</Typography>
                ) : (
                    <List>
                        {sortedFeatures.map((feature) => (
                            <ListItem
                                key={feature.id}
                                sx={{
                                    cursor: onSelectFeature ? "pointer" : "default",
                                    bgcolor:
                                        currentFeatureId === feature.id
                                            ? "action.selected"
                                            : "transparent",
                                    borderRadius: 1,
                                    mb: 1,
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                                onClick={() => onSelectFeature?.(feature.id)}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="body1" noWrap>
                                                {feature.name || "Unnamed Feature"}
                                            </Typography>
                                            {feature.isRevealed && (
                                                <Chip
                                                    label="Revealed"
                                                    size="small"
                                                    color="success"
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        feature.link ? (
                                            <Typography
                                                variant="caption"
                                                color="primary"
                                                noWrap
                                                component="a"
                                                href={feature.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {feature.link}
                                            </Typography>
                                        ) : null
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Drawer>
    );
}
