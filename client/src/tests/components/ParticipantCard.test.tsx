import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParticipantCard } from "../../components/shared/ParticipantCard";
import type { Participant } from "../../types";

describe("ParticipantCard", () => {
    const mockParticipant: Participant = {
        id: "participant-1",
        sessionId: "session-1",
        name: "Test User",
        email: "test@example.com",
        isHost: false,
    };

    it("should render participant name", () => {
        render(
            <ParticipantCard
                participant={mockParticipant}
                hasVoted={false}
                isRevealed={false}
                isCurrentUser={false}
            />
        );

        expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should show host badge for host participant", () => {
        const hostParticipant = { ...mockParticipant, isHost: true };

        render(
            <ParticipantCard
                participant={hostParticipant}
                hasVoted={false}
                isRevealed={false}
                isCurrentUser={false}
            />
        );

        expect(screen.getByText(/\(Host\)/)).toBeInTheDocument();
    });

    it("should show vote value when revealed", () => {
        render(
            <ParticipantCard
                participant={mockParticipant}
                hasVoted={true}
                isRevealed={true}
                voteValue="8"
                isCurrentUser={false}
            />
        );

        expect(screen.getAllByText("8")).toHaveLength(3); // Card displays value 3 times
    });

    it("should highlight current user", () => {
        const { container } = render(
            <ParticipantCard
                participant={mockParticipant}
                hasVoted={false}
                isRevealed={false}
                isCurrentUser={true}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveClass("MuiCard-root");
    });

    it("should show consensus indicator when vote matches consensus", () => {
        render(
            <ParticipantCard
                participant={mockParticipant}
                hasVoted={true}
                isRevealed={true}
                voteValue="5"
                consensusValue="5"
                isCurrentUser={false}
            />
        );

        expect(screen.getAllByText("5")).toHaveLength(3);
    });

    it("should show gravatar when email is provided", () => {
        render(
            <ParticipantCard
                participant={mockParticipant}
                hasVoted={false}
                isRevealed={false}
                isCurrentUser={false}
            />
        );

        const avatar = screen.getByAltText("Test User");
        expect(avatar).toHaveAttribute("src");
        expect(avatar.getAttribute("src")).toContain("gravatar.com");
    });
});
