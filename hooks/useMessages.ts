'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Message, MessageInput } from '@/types/message.types';
import { useSocket } from './useSocket';
import { useEffect } from 'react';

/**
 * React Query hook for messages (server state)
 * Handles fetching, caching, and mutations for messages
 * Uses optimistic updates for sends
 */

const messagesQueryKey = (roomId: string) => ['messages', roomId];

export const useMessages = (roomId: string) => {
    const queryClient = useQueryClient();
    const socket = useSocket();

    // Fetch messages for a room
    const messagesQuery = useQuery({
        queryKey: messagesQueryKey(roomId),
        queryFn: async () => {
            const { data } = await apiClient.get<Message[]>(`/rooms/${roomId}/messages`);
            return data;
        },
        enabled: !!roomId,
    });

    // Send message mutation with optimistic update
    const sendMessageMutation = useMutation({
        mutationFn: async (input: MessageInput) => {
            const { data } = await apiClient.post<Message>('/messages', input);
            return data;
        },
        onMutate: async (newMessage) => {
            // Cancel ongoing refetches
            await queryClient.cancelQueries({ queryKey: messagesQueryKey(roomId) });

            // Get previous messages
            const previousMessages = queryClient.getQueryData<Message[]>(
                messagesQueryKey(roomId)
            );

            // Optimistically update cache with temporary message
            const optimisticMessage: Message = {
                id: `temp-${Date.now()}`,
                content: newMessage.content,
                roomId: newMessage.roomId,
                author: {
                    id: 'current-user',
                    username: 'You',
                    email: 'current@user.com',
                    createdAt: new Date(),
                },
                createdAt: new Date(),
            };

            if (previousMessages) {
                queryClient.setQueryData(messagesQueryKey(roomId), [
                    ...previousMessages,
                    optimisticMessage,
                ]);
            }

            return { previousMessages, optimisticMessage };
        },
        onError: (_, __, context) => {
            // Rollback on error
            if (context?.previousMessages) {
                queryClient.setQueryData(messagesQueryKey(roomId), context.previousMessages);
            }
        },
    });

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;

        socket.on('message:sent', (payload) => {
            // Add new message to cache
            queryClient.setQueryData(messagesQueryKey(roomId), (old: Message[] | undefined) => {
                if (!old) return [payload.message];
                // Remove temporary message if it exists
                return old
                    .filter((m) => !m.id.startsWith('temp-'))
                    .concat(payload.message);
            });
        });

        socket.on('message:deleted', ({ messageId }) => {
            queryClient.setQueryData(messagesQueryKey(roomId), (old: Message[] | undefined) => {
                if (!old) return old;
                return old.filter((m) => m.id !== messageId);
            });
        });

        return () => {
            socket.off('message:sent');
            socket.off('message:deleted');
        };
    }, [socket, roomId, queryClient]);

    return {
        messages: messagesQuery.data ?? [],
        isLoading: messagesQuery.isLoading,
        error: messagesQuery.error,
        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isPending,
    };
};
