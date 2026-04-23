'use client';

import { useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import getSocket from '@/lib/socket';

/**
 * Base hook for socket connection
 * Returns the singleton socket instance
 * This hook manages a singleton socket that persists across re-renders
 */

export const useSocket = (): Socket | null => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = getSocket();
        }
    }, []);

    // eslint-disable-next-line react-hooks/refs
    return socketRef.current;
};