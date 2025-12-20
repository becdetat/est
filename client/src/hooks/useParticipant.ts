import { useState } from "react";
import { loadUserDetails, saveUserDetails, generateParticipantId } from "../utils/storage";

/**
 * Custom hook for managing participant information
 */
export function useParticipant() {
    const [participant, setParticipant] = useState<{
        id: string;
        name: string;
        email?: string;
    } | null>(() => {
        const stored = loadUserDetails();
        if (stored) {
            return {
                id: stored.id || generateParticipantId(),
                name: stored.name,
                email: stored.email,
            };
        }
        return null;
    });

    const updateParticipant = (name: string, email?: string) => {
        const id = participant?.id || generateParticipantId();
        saveUserDetails(name, email, id);
        setParticipant({ id, name, email });
    };

    return {
        participant,
        updateParticipant,
    };
}
