'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';

/**
 * Socket hook for typing indicators
 * Manages typing start/stop events
 */

interface TypingUser {
    userId: string;
    username: string;
}

export const useTyping = (roomId: string) => {
    const socket = useSocket();
    const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(new Map());

    const startTyping = useCallback(() => {
        if (socket && roomId) {
            socket.emit('typing:start', { roomId });
        }
    }, [socket, roomId]);

    const stopTyping = useCallback(() => {
        if (socket && roomId) {
            socket.emit('typing:stop', { roomId });
        }
    }, [socket, roomId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('typing:start', (payload) => {
            if (payload.roomId === roomId) {
                setTypingUsers((prev) => {
                    const next = new Map(prev);
                    next.set(payload.userId, {
                        userId: payload.userId,
                        username: payload.username,
                    });
                    return next;
                });
            }
        });

        socket.on('typing:stop', (payload) => {
            if (payload.roomId === roomId) {
                setTypingUsers((prev) => {
                    const next = new Map(prev);
                    next.delete(payload.userId);
                    return next;
                });
            }
        });

        return () => {
            socket.off('typing:start');
            socket.off('typing:stop');
        };
    }, [socket, roomId]);

    return {
        typingUsers: Array.from(typingUsers.values()),
        startTyping,
        stopTyping,
    };
};
