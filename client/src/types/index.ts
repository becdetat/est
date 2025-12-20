export type EstimationType = "FIBONACCI" | "TSHIRT";

export const FIBONACCI_VALUES = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "5", label: "5" },
    { value: "8", label: "8" },
    { value: "13", label: "13" },
    { value: "21", label: "21" },
    { value: "?", label: "?" },
    { value: "☕", label: "☕" },
];

export const TSHIRT_VALUES = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "?", label: "?" },
    { value: "☕", label: "☕" },
];

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
    votes?: Vote[];
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
