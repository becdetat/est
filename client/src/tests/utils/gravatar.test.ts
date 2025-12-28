import { describe, it, expect } from "vitest";
import { getGravatarUrl } from "../../utils/gravatar";

describe("gravatar", () => {
    describe("getGravatarUrl", () => {
        it("should generate gravatar URL for email", () => {
            const email = "test@example.com";
            const url = getGravatarUrl(email);

            expect(url).toContain("gravatar.com/avatar/");
            expect(url).toContain("&s=");
            expect(url).toContain("?d=");
        });

        it("should use default size of 80", () => {
            const url = getGravatarUrl("test@example.com");

            expect(url).toContain("&s=80");
        });

        it("should accept custom size", () => {
            const url = getGravatarUrl("test@example.com", 400);

            expect(url).toContain("&s=400");
        });

        it("should handle email with different cases", () => {
            const url1 = getGravatarUrl("Test@Example.COM");
            const url2 = getGravatarUrl("test@example.com");

            // Both should produce the same hash (case-insensitive)
            expect(url1).toBe(url2);
        });

        it("should handle email with whitespace", () => {
            const url = getGravatarUrl("  test@example.com  ");

            expect(url).not.toContain("%20"); // Should be trimmed
        });

        it("should return valid URL", () => {
            const url = getGravatarUrl("test@example.com");

            expect(() => new URL(url)).not.toThrow();
        });

        it("should handle undefined email", () => {
            const url = getGravatarUrl(undefined);

            expect(url).toContain("gravatar.com/avatar/");
            expect(url).toContain("?d=mp");
        });
    });
});
