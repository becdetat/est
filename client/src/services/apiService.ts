const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Create a new estimation session
 */
export async function createSession(
    hostName: string,
    estimationType: "FIBONACCI" | "TSHIRT",
    hostEmail?: string
) {
    const response = await fetch(`${API_URL}/api/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            hostName,
            hostEmail,
            estimationType,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create session");
    }

    return response.json();
}

/**
 * Get session details
 */
export async function getSession(sessionId: string) {
    const response = await fetch(`${API_URL}/api/sessions/${sessionId}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Session not found or expired");
        }
        throw new Error("Failed to fetch session");
    }

    return response.json();
}

/**
 * Join a session
 */
export async function joinSession(
    sessionId: string,
    participantId: string,
    name: string,
    email?: string
) {
    const response = await fetch(`${API_URL}/api/sessions/${sessionId}/participants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            participantId,
            name,
            email,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to join session");
    }

    return response.json();
}

/**
 * Get all features for a session
 */
export async function getFeatures(sessionId: string) {
    const response = await fetch(`${API_URL}/api/sessions/${sessionId}/features`);

    if (!response.ok) {
        throw new Error("Failed to fetch features");
    }

    return response.json();
}
