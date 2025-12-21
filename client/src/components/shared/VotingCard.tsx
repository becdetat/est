import { Card, CardActionArea, Typography, Box } from "@mui/material";

interface VotingCardProps {
    value: string;
    label?: string;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

/**
 * Individual voting card component with playing card style
 */
export function VotingCard({
    value,
    label,
    selected = false,
    disabled = false,
    onClick,
}: VotingCardProps) {
    const displayValue = label || value;
    
    return (
        <Card
            sx={{
                width: 80,
                height: 110,
                border: selected ? "3px solid" : "2px solid",
                borderColor: selected ? "primary.main" : "divider",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.2s",
                position: "relative",
                bgcolor: "background.paper",
                "&:hover": {
                    transform: !disabled ? "translateY(-4px)" : "none",
                    boxShadow: !disabled ? 4 : 1,
                },
            }}
        >
            <CardActionArea
                onClick={onClick}
                disabled={disabled}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                {/* Top left corner */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 4,
                        left: 6,
                        textAlign: "left",
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={selected ? "primary.main" : "text.primary"}
                        sx={{ lineHeight: 1, fontSize: "0.875rem" }}
                    >
                        {displayValue}
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
                        color={selected ? "primary.main" : "text.primary"}
                        sx={{ fontSize: "2.5rem" }}
                    >
                        {displayValue}
                    </Typography>
                </Box>

                {/* Bottom right corner (upside down) */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 6,
                        textAlign: "right",
                        transform: "rotate(180deg)",
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={selected ? "primary.main" : "text.primary"}
                        sx={{ lineHeight: 1, fontSize: "0.875rem" }}
                    >
                        {displayValue}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    );
}
