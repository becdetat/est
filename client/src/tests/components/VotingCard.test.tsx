import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VotingCard } from "../../components/shared/VotingCard";

describe("VotingCard", () => {
    it("should render card with value", () => {
        render(<VotingCard value="5" />);

        expect(screen.getAllByText("5")).toHaveLength(3); // Top-left, center, bottom-right
    });

    it("should render card with custom label", () => {
        render(<VotingCard value="XL" label="Extra Large" />);

        expect(screen.getAllByText("Extra Large")).toHaveLength(3);
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();
        render(<VotingCard value="8" onClick={handleClick} />);

        const card = screen.getByRole("button");
        fireEvent.click(card);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
        const handleClick = vi.fn();
        render(<VotingCard value="8" disabled onClick={handleClick} />);

        const card = screen.getByRole("button");
        fireEvent.click(card);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it("should show selected state", () => {
        const { container } = render(<VotingCard value="13" selected />);

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle({ borderWidth: "3px" });
    });

    it("should show disabled state with reduced opacity", () => {
        const { container } = render(<VotingCard value="21" disabled />);

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle({ opacity: "0.5" });
    });

    it("should not show disabled state when enabled", () => {
        const { container } = render(<VotingCard value="21" disabled={false} />);

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle({ opacity: "1" });
    });
});
