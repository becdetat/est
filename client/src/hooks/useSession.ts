import { useState, useEffect, useCallback } from "react";
import type { Session, Feature, Participant } from "../types";
import { getSession, getFeatures } from "../services/apiService";

/**
 * Custom hook for managing session state
 */
export function useSession(sessionId: string | undefined) {
    const [session, setSession] = useState<Session | null>(null);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSession = useCallback(async () => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const [sessionResponse, featuresData] = await Promise.all([
                getSession(sessionId),
                getFeatures(sessionId),
            ]);

            setSession(sessionResponse.session);
            setParticipants(sessionResponse.session.participants || []);
            setFeatures(featuresData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load session");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    const updateFeature = (updatedFeature: Feature) => {
        setFeatures((prev) =>
            prev.map((f) => (f.id === updatedFeature.id ? updatedFeature : f))
        );
    };

    const addFeature = (newFeature: Feature) => {
        setFeatures((prev) => [...prev, newFeature]);
    };

    const addParticipant = (participant: Participant) => {
        setParticipants((prev) => {
            if (prev.some((p) => p.id === participant.id)) {
                return prev;
            }
            return [...prev, participant];
        });
    };

    const removeParticipant = (participantId: string) => {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    };

    return {
        session,
        features,
        participants,
        loading,
        error,
        updateFeature,
        addFeature,
        addParticipant,
        removeParticipant,
        refresh: loadSession,
        setFeatures,
    };
}
