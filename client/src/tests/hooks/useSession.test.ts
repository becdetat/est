import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSession } from "../../hooks/useSession";
import { getSession, getFeatures } from "../../services/apiService";
import type { Session, Feature, Participant } from "../../types";

// Mock API service
vi.mock("../../services/apiService", () => ({
    getSession: vi.fn(),
    getFeatures: vi.fn(),
}));

describe("useSession", () => {
    const mockSession: Session & { participants: Participant[] } = {
        id: "session-1",
        estimationType: "FIBONACCI",
        createdAt: new Date().toISOString(),
        participants: [
            {
                id: "participant-1",
                sessionId: "session-1",
                name: "Test User",
                email: "test@example.com",
                isHost: true,
            },
        ],
    };

    const mockFeatures: Feature[] = [
        {
            id: "feature-1",
            sessionId: "session-1",
            name: "Test Feature",
            link: "https://example.com",
            isRevealed: false,
            createdAt: new Date().toISOString(),
            votes: [],
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load session data on mount", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.session).toEqual(mockSession);
        expect(result.current.features).toEqual(mockFeatures);
        expect(result.current.participants).toEqual(mockSession.participants);
        expect(result.current.error).toBeNull();
    });

    it("should handle undefined sessionId", async () => {
        const { result } = renderHook(() => useSession(undefined));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.session).toBeNull();
        expect(result.current.features).toEqual([]);
        expect(getSession).not.toHaveBeenCalled();
    });

    it("should handle API errors", async () => {
        const errorMessage = "Failed to load session";
        vi.mocked(getSession).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe(errorMessage);
        expect(result.current.session).toBeNull();
    });

    it("should update a feature", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const updatedFeature: Feature = {
            ...mockFeatures[0],
            isRevealed: true,
        };

        result.current.updateFeature(updatedFeature);

        await waitFor(() => {
            expect(result.current.features[0].isRevealed).toBe(true);
        });
    });

    it("should add a new feature", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const newFeature: Feature = {
            id: "feature-2",
            sessionId: "session-1",
            name: "New Feature",
            link: undefined,
            isRevealed: false,
            createdAt: new Date().toISOString(),
            votes: [],
        };

        result.current.addFeature(newFeature);

        await waitFor(() => {
            expect(result.current.features).toHaveLength(2);
            expect(result.current.features[1]).toEqual(newFeature);
        });
    });

    it("should add a participant", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const newParticipant: Participant = {
            id: "participant-2",
            sessionId: "session-1",
            name: "New User",
            email: undefined,
            isHost: false,
        };

        result.current.addParticipant(newParticipant);

        await waitFor(() => {
            expect(result.current.participants).toHaveLength(2);
            expect(result.current.participants[1]).toEqual(newParticipant);
        });
    });

    it("should not add duplicate participant", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        result.current.addParticipant(mockSession.participants[0]);

        await waitFor(() => {
            expect(result.current.participants).toHaveLength(1);
        });
    });

    it("should remove a participant", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        result.current.removeParticipant("participant-1");

        await waitFor(() => {
            expect(result.current.participants).toHaveLength(0);
        });
    });

    it("should refresh session data", async () => {
        vi.mocked(getSession).mockResolvedValue({ session: mockSession });
        vi.mocked(getFeatures).mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useSession("session-1"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Update mock data
        const updatedMockSession = { ...mockSession, estimationType: "TSHIRT" as const };
        vi.mocked(getSession).mockResolvedValue({ session: updatedMockSession });

        result.current.refresh();

        await waitFor(() => {
            expect(result.current.session?.estimationType).toBe("TSHIRT");
        });
    });
});
