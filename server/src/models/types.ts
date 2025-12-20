export interface CreateSessionRequest {
    hostName: string;
    hostEmail?: string;
    estimationType: "FIBONACCI" | "TSHIRT";
}

export interface CreateSessionResponse {
    sessionId: string;
    hostParticipantId: string;
}

export interface JoinSessionRequest {
    participantId: string;
    name: string;
    email?: string;
}

export interface CreateFeatureRequest {
    participantId: string;
    name?: string;
    link?: string;
}

export interface SubmitVoteRequest {
    participantId: string;
    featureId: string;
    value: string;
}

export interface RevealResultsRequest {
    participantId: string;
    featureId: string;
}
