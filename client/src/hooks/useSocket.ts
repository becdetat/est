import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import socketService from "../services/socketService";
import type { SessionData, Participant, Feature } from "../types";

interface SocketEvents {
    "session-joined": (data: SessionData) => void;
    "vote-submitted": (data: { featureId: string; participantId: string; value: string }) => void;
    "vote-unsubmitted": (data: { featureId: string; participantId: string }) => void;
    "feature-started": (data: { feature: Feature }) => void;
    "results-revealed": (data: { feature: Feature; hasConsensus: boolean }) => void;
    "participant-joined": (participant: Participant) => void;
    "participant-left": (participantId: string) => void;
    "host-disconnected": () => void;
    "session-closed": (data: { sessionId: string }) => void;
}

/**
 * Custom hook for managing Socket.IO connection and events
 */
export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        const newSocket = socketService.connect();
        setSocket(newSocket);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        newSocket.on("connect", handleConnect);
        newSocket.on("disconnect", handleDisconnect);

        return () => {
            newSocket.off("connect", handleConnect);
            newSocket.off("disconnect", handleDisconnect);
            socketService.disconnect();
        };
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const on = <E extends keyof SocketEvents>(
        event: E,
        handler: SocketEvents[E]
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket?.on(event, handler as any);
    };

    const off = <E extends keyof SocketEvents>(
        event: E,
        handler: SocketEvents[E]
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket?.off(event, handler as any);
    };

    return {
        socket,
        isConnected,
        on,
        off,
        joinSession: socketService.joinSession.bind(socketService),
        submitVote: socketService.submitVote.bind(socketService),
        unsubmitVote: socketService.unsubmitVote.bind(socketService),
        startFeature: socketService.startFeature.bind(socketService),
        revealResults: socketService.revealResults.bind(socketService),
        closeSession: socketService.closeSession.bind(socketService),
    };
}
