import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useParticipant } from "../../hooks/useParticipant";

describe("useParticipant", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("should initialize with null participant when storage is empty", () => {
        const { result } = renderHook(() => useParticipant());

        expect(result.current.participant).toBeNull();
    });

    it("should update participant", () => {
        const { result } = renderHook(() => useParticipant());

        act(() => {
            result.current.updateParticipant("New User", "new@example.com", "test-id");
        });

        expect(result.current.participant).toMatchObject({
            id: "test-id",
            name: "New User",
            email: "new@example.com",
        });
    });

    it("should update participant without email", () => {
        const { result } = renderHook(() => useParticipant());

        act(() => {
            result.current.updateParticipant("Test User", undefined, "test-id");
        });

        expect(result.current.participant).toMatchObject({
            id: "test-id",
            name: "Test User",
        });
        expect(result.current.participant?.email).toBeUndefined();
    });

    it("should generate participant ID when not provided", () => {
        const { result } = renderHook(() => useParticipant());

        act(() => {
            result.current.updateParticipant("Test User", "test@example.com");
        });

        expect(result.current.participant?.id).toBeDefined();
        expect(result.current.participant?.name).toBe("Test User");
    });

    it("should preserve participant ID when updating without providing new ID", () => {
        const { result } = renderHook(() => useParticipant());

        act(() => {
            result.current.updateParticipant("First Name", "first@example.com", "original-id");
        });

        expect(result.current.participant?.id).toBe("original-id");

        act(() => {
            result.current.updateParticipant("Second Name", "second@example.com");
        });

        expect(result.current.participant?.id).toBe("original-id");
    });
});
