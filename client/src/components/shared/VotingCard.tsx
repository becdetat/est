import { Card, CardActionArea, Typography } from "@mui/material";

interface VotingCardProps {
    value: string;
    label?: string;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

/**
 * Individual voting card component
 */
export function VotingCard({
    value,
    label,
    selected = false,
    disabled = false,
    onClick,
}: VotingCardProps) {
    return (
        <Card
            sx={{
                width: 80,
                height: 110,
                border: selected ? "3px solid" : "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.2s",
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
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h4" component="div">
                    {label || value}
                </Typography>
                {label && label !== value && (
                    <Typography variant="caption" color="text.secondary">
                        {value}
                    </Typography>
                )}
            </CardActionArea>
        </Card>
    );
}
