import { v4 as uuidv4 } from "uuid";

const USER_NAME_KEY = "est_user_name";
const USER_EMAIL_KEY = "est_user_email";
const PARTICIPANT_ID_KEY = "est_participant_id";

/**
 * Save user details to localStorage
 */
export function saveUserDetails(name: string, email?: string, participantId?: string): void {
    localStorage.setItem(USER_NAME_KEY, name);
    if (email) {
        localStorage.setItem(USER_EMAIL_KEY, email);
    } else {
        localStorage.removeItem(USER_EMAIL_KEY);
    }
    if (participantId) {
        localStorage.setItem(PARTICIPANT_ID_KEY, participantId);
    }
}

/**
 * Load user details from localStorage
 */
export function loadUserDetails(): { name: string; email?: string; id?: string } | null {
    const name = localStorage.getItem(USER_NAME_KEY);
    if (!name) {
        return null;
    }

    const email = localStorage.getItem(USER_EMAIL_KEY) || undefined;
    const id = localStorage.getItem(PARTICIPANT_ID_KEY) || undefined;
    return { name, email, id };
}

/**
 * Clear user details from localStorage
 */
export function clearUserDetails(): void {
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(PARTICIPANT_ID_KEY);
}

/**
 * Generate a unique participant ID
 */
export function generateParticipantId(): string {
    return uuidv4();
}
