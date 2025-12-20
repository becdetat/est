import { describe, it, expect } from "vitest";
import {
    getDaysAgo,
    isOlderThan,
    formatDateForLog,
    getAgeInDays,
} from "../src/utils/dateHelpers";

describe("Date Helpers", () => {
    describe("getDaysAgo", () => {
        it("should return a date in the past", () => {
            const result = getDaysAgo(7);
            const now = new Date();
            const expected = new Date();
            expected.setDate(expected.getDate() - 7);

            // Check if the dates are close (within 1 second to account for test execution time)
            expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(1000);
        });

        it("should handle zero days", () => {
            const result = getDaysAgo(0);
            const now = new Date();

            expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(1000);
        });

        it("should handle large numbers", () => {
            const result = getDaysAgo(365);
            const expected = new Date();
            expected.setDate(expected.getDate() - 365);

            expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(1000);
        });
    });

    describe("isOlderThan", () => {
        it("should return true for dates older than specified days", () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 30);

            expect(isOlderThan(oldDate, 28)).toBe(true);
        });

        it("should return false for dates newer than specified days", () => {
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 7);

            expect(isOlderThan(recentDate, 28)).toBe(false);
        });

        it("should handle edge case of exact cutoff", () => {
            const exactDate = new Date();
            exactDate.setDate(exactDate.getDate() - 28);

            // The exact date should be considered not older (on the boundary)
            expect(isOlderThan(exactDate, 28)).toBe(false);
        });
    });

    describe("formatDateForLog", () => {
        it("should format date as ISO string", () => {
            const date = new Date("2025-12-20T00:00:00.000Z");
            const result = formatDateForLog(date);

            expect(result).toBe("2025-12-20T00:00:00.000Z");
        });

        it("should handle current date", () => {
            const date = new Date();
            const result = formatDateForLog(date);

            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });

    describe("getAgeInDays", () => {
        it("should calculate age in days correctly", () => {
            const date = new Date();
            date.setDate(date.getDate() - 10);

            const age = getAgeInDays(date);

            expect(age).toBeGreaterThanOrEqual(10);
            expect(age).toBeLessThanOrEqual(11); // Allow for rounding
        });

        it("should return 0 or 1 for current date", () => {
            const date = new Date();
            const age = getAgeInDays(date);

            expect(age).toBeLessThanOrEqual(1);
        });

        it("should handle dates far in the past", () => {
            const date = new Date();
            date.setDate(date.getDate() - 365);

            const age = getAgeInDays(date);

            expect(age).toBeGreaterThanOrEqual(365);
            expect(age).toBeLessThanOrEqual(366);
        });
    });
});
