import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParticipantList } from "../../components/shared/ParticipantList";
import type { Participant } from "../../types";

describe("ParticipantList", () => {
    const mockParticipants: Participant[] = [
        {
            id: "1",
            sessionId: "session-1",
            name: "Alice",
            email: "alice@example.com",
            isHost: true,
        },
        {
            id: "2",
            sessionId: "session-1",
            name: "Bob",
            isHost: false,
        },
        {
            id: "3",
            sessionId: "session-1",
            name: "Charlie",
            email: "charlie@example.com",
            isHost: false,
        },
    ];

    const mockVotes = {
        "1": "5",
        "2": "8",
    };

    it("should render list of participants", () => {
        render(
            <ParticipantList
                participants={mockParticipants}
                votes={mockVotes}
            />
        );

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("should show participant count in header", () => {
        render(
            <ParticipantList
                participants={mockParticipants}
                votes={mockVotes}
            />
        );

        expect(screen.getByText(/Participants \(3\)/)).toBeInTheDocument();
    });

    it("should show host indicator", () => {
        render(
            <ParticipantList
                participants={mockParticipants}
                votes={mockVotes}
            />
        );

        expect(screen.getByText("Host")).toBeInTheDocument();
    });

});
