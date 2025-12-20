export type EstimationType = "FIBONACCI" | "TSHIRT";

export const FIBONACCI_VALUES = ["1", "2", "3", "5", "8", "13", "21"];
export const TSHIRT_VALUES = ["XS", "S", "M", "L", "XL", "XXL"];

export interface Session {
    id: string;
    estimationType: EstimationType;
    createdAt: string;
}

export interface Participant {
    id: string;
    sessionId: string;
    name: string;
    email?: string;
    isHost: boolean;
}

export interface Feature {
    id: string;
    sessionId: string;
    name?: string;
    link?: string;
    isRevealed: boolean;
    createdAt: string;
}

export interface Vote {
    id: string;
    featureId: string;
    participantId: string;
    value: string;
}

export interface SessionData {
    session: Session;
    participants: Participant[];
    features: Feature[];
    currentFeature?: Feature;
    votes: Vote[];
}
