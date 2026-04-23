'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { User } from '@/types/user.types';

/**
 * Socket hook for user presence/availability status
 * Manages who is online in a room
 */

interface UserPresence extends User {
    status: 'online' | 'offline' | 'away';
}

export const usePresence = (roomId: string) => {
    const socket = useSocket();
    const [onlineUsers, setOnlineUsers] = useState<Map<string, UserPresence>>(new Map());

    const setStatus = useCallback(
        (status: 'online' | 'offline' | 'away') => {
            if (socket && roomId) {
                socket.emit('presence:update', { roomId, status });
            }
        },
        [socket, roomId]
    );

    useEffect(() => {
        if (!socket) return;

        socket.on('user:joined', (payload) => {
            if (payload.roomId === roomId) {
                setOnlineUsers((prev) => {
                    const next = new Map(prev);
                    next.set(payload.user.id, { ...payload.user, status: 'online' });
                    return next;
                });
            }
        });

        socket.on('user:left', (payload) => {
            if (payload.roomId === roomId) {
                setOnlineUsers((prev) => {
                    const next = new Map(prev);
                    next.delete(payload.userId);
                    return next;
                });
            }
        });

        socket.on('presence:update', (payload) => {
            if (payload.roomId === roomId) {
                setOnlineUsers((prev) => {
                    const next = new Map(prev);
                    const user = next.get(payload.userId);
                    if (user) {
                        next.set(payload.userId, { ...user, status: payload.status });
                    }
                    return next;
                });
            }
        });

        return () => {
            socket.off('user:joined');
            socket.off('user:left');
            socket.off('presence:update');
        };
    }, [socket, roomId]);

    return {
        onlineUsers: Array.from(onlineUsers.values()),
        setStatus,
    };
};
