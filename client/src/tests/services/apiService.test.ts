import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createSession,
    joinSession,
    getSession,
    getFeatures,
} from "../../services/apiService";

// Mock fetch
global.fetch = vi.fn();

describe("apiService", () => {
    const API_URL = "http://localhost:3001/api";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createSession", () => {
        it("should create a new session", async () => {
            const mockResponse = {
                sessionId: "session-1",
                hostParticipantId: "participant-1",
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await createSession("Test Host", "FIBONACCI", "test@example.com");

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_URL}/sessions`,
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hostName: "Test Host",
                        hostEmail: "test@example.com",
                        estimationType: "FIBONACCI",
                    }),
                })
            );
        });

        it("should handle API errors", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                statusText: "Bad Request",
            });

            await expect(
                createSession("Test Host", "FIBONACCI", "test@example.com")
            ).rejects.toThrow();
        });
    });

    describe("joinSession", () => {
        it("should join a session", async () => {
            const mockResponse = {
                participant: {
                    id: "participant-1",
                    name: "Test User",
                    email: "test@example.com",
                },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await joinSession(
                "session-1",
                "participant-1",
                "Test User",
                "test@example.com"
            );

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_URL}/sessions/session-1/participants`,
                expect.objectContaining({
                    method: "POST",
                })
            );
        });
    });

    describe("getSession", () => {
        it("should fetch session data", async () => {
            const mockSession = {
                session: {
                    id: "session-1",
                    estimationType: "FIBONACCI",
                    participants: [],
                    features: [],
                },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSession,
            });

            const result = await getSession("session-1");

            expect(result).toEqual(mockSession);
            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/sessions/session-1`);
        });

        it("should handle 404 errors", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            });

            await expect(getSession("non-existent")).rejects.toThrow();
        });
    });

    describe("getFeatures", () => {
        it("should fetch features for a session", async () => {
            const mockFeatures = [
                {
                    id: "feature-1",
                    sessionId: "session-1",
                    name: "Feature 1",
                    isRevealed: false,
                    votes: [],
                },
            ];

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockFeatures,
            });

            const result = await getFeatures("session-1");

            expect(result).toEqual(mockFeatures);
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_URL}/sessions/session-1/features`
            );
        });

        it("should return empty array for session with no features", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const result = await getFeatures("session-1");

            expect(result).toEqual([]);
        });
    });

    describe("error handling", () => {
        it("should handle network errors", async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

            await expect(getSession("session-1")).rejects.toThrow("Network error");
        });

        it("should handle JSON parse errors", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new Error("Invalid JSON");
                },
            });

            await expect(getSession("session-1")).rejects.toThrow();
        });
    });
});
