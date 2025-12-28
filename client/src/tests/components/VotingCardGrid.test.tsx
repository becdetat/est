import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VotingCardGrid } from "../../components/shared/VotingCardGrid";

describe("VotingCardGrid", () => {
    it("should render Fibonacci cards", () => {
        render(
            <VotingCardGrid
                estimationType="FIBONACCI"
                onSelectCard={() => {}}
            />
        );

        expect(screen.getAllByText("0")).toHaveLength(3);
        expect(screen.getAllByText("1")).toHaveLength(3);
        expect(screen.getAllByText("2")).toHaveLength(3);
        expect(screen.getAllByText("3")).toHaveLength(3);
        expect(screen.getAllByText("5")).toHaveLength(3);
        expect(screen.getAllByText("8")).toHaveLength(3);
        expect(screen.getAllByText("13")).toHaveLength(3);
    });

    it("should render T-shirt size cards", () => {
        render(
            <VotingCardGrid
                estimationType="TSHIRT"
                onSelectCard={() => {}}
            />
        );

        expect(screen.getAllByText("XS")).toHaveLength(3);
        expect(screen.getAllByText("S")).toHaveLength(3);
        expect(screen.getAllByText("M")).toHaveLength(3);
        expect(screen.getAllByText("L")).toHaveLength(3);
        expect(screen.getAllByText("XL")).toHaveLength(3);
    });

    it("should mark selected card", () => {
        const { container } = render(
            <VotingCardGrid
                estimationType="FIBONACCI"
                selectedValue="5"
                onSelectCard={() => {}}
            />
        );

        const cards = container.querySelectorAll(".MuiCard-root");
        const selectedCard = Array.from(cards).find(card => 
            card.textContent?.includes("5")
        );
        
        expect(selectedCard).toHaveStyle({ borderWidth: "3px" });
    });

    it("should disable all cards when disabled prop is true", () => {
        render(
            <VotingCardGrid
                estimationType="FIBONACCI"
                disabled={true}
                onSelectCard={() => {}}
            />
        );

        const buttons = screen.getAllByRole("button");
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });
});
