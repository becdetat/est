import { Box } from "@mui/material";
import { VotingCard } from "./VotingCard";
import { FIBONACCI_VALUES, TSHIRT_VALUES } from "../../types";

interface VotingCardGridProps {
    estimationType: "FIBONACCI" | "TSHIRT";
    selectedValue?: string;
    disabled?: boolean;
    onSelectCard: (value: string) => void;
}

/**
 * Grid of voting cards based on estimation type
 */
export function VotingCardGrid({
    estimationType,
    selectedValue,
    disabled = false,
    onSelectCard,
}: VotingCardGridProps) {
    const values =
        estimationType === "FIBONACCI" ? FIBONACCI_VALUES : TSHIRT_VALUES;

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                maxWidth: 600,
                margin: "0 auto",
            }}
        >
            {values.map((item) => (
                <VotingCard
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    selected={selectedValue === item.value}
                    disabled={disabled}
                    onClick={() => onSelectCard(item.value)}
                />
            ))}
        </Box>
    );
}
