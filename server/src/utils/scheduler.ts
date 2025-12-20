import cron from "node-cron";
import cleanupService from "../services/cleanupService";

/**
 * Initialize scheduled cleanup jobs
 */
export function initializeScheduledJobs(): void {
    // Run cleanup every day at 2:00 AM
    // Cron pattern: "0 2 * * *" = minute 0, hour 2, every day
    cron.schedule("0 2 * * *", async () => {
        console.log("[Scheduler] Running daily cleanup job at", new Date().toISOString());
        try {
            const deletedCount = await cleanupService.deleteOldSessions(28);
            console.log(`[Scheduler] Cleanup completed. Deleted ${deletedCount} old sessions.`);
        } catch (error) {
            console.error("[Scheduler] Error during scheduled cleanup:", error);
        }
    });

    console.log("[Scheduler] Scheduled jobs initialized. Daily cleanup at 2:00 AM.");
}

/**
 * Manually trigger cleanup job (useful for testing or manual maintenance)
 */
export async function runCleanupManually(): Promise<number> {
    console.log("[Scheduler] Manual cleanup triggered at", new Date().toISOString());
    try {
        const deletedCount = await cleanupService.deleteOldSessions(28);
        console.log(`[Scheduler] Manual cleanup completed. Deleted ${deletedCount} old sessions.`);
        return deletedCount;
    } catch (error) {
        console.error("[Scheduler] Error during manual cleanup:", error);
        throw error;
    }
}
