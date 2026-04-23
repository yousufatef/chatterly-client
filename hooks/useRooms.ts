'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Room } from '@/types/room.types';
import { useSocket } from './useSocket';
import { useEffect } from 'react';

/**
 * React Query hook for rooms (server state)
 * Handles fetching and caching rooms
 */

const roomsQueryKey = ['rooms'];

export const useRooms = () => {
    const queryClient = useQueryClient();
    const socket = useSocket();

    // Fetch all rooms
    const roomsQuery = useQuery({
        queryKey: roomsQueryKey,
        queryFn: async () => {
            const { data } = await apiClient.get<Room[]>('/rooms');
            return data;
        },
    });

    // Listen for room updates via socket
    useEffect(() => {
        if (!socket) return;

        socket.on('room:created', (room: Room) => {
            queryClient.setQueryData(roomsQueryKey, (old: Room[] | undefined) => {
                if (!old) return [room];
                return [...old, room];
            });
        });

        socket.on('room:updated', (room: Room) => {
            queryClient.setQueryData(roomsQueryKey, (old: Room[] | undefined) => {
                if (!old) return [room];
                return old.map((r) => (r.id === room.id ? room : r));
            });
        });

        socket.on('room:deleted', ({ roomId }) => {
            queryClient.setQueryData(roomsQueryKey, (old: Room[] | undefined) => {
                if (!old) return old;
                return old.filter((r) => r.id !== roomId);
            });
        });

        return () => {
            socket.off('room:created');
            socket.off('room:updated');
            socket.off('room:deleted');
        };
    }, [socket, queryClient]);

    return {
        rooms: roomsQuery.data ?? [],
        isLoading: roomsQuery.isLoading,
        error: roomsQuery.error,
    };
};
