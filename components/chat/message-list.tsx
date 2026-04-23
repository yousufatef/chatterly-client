'use client';

import { useMessages } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/auth.store';
import { MessageItem } from './message-item';
import { useEffect, useRef } from 'react';

interface MessageListProps {
    roomId: string;
}

export function MessageList({ roomId }: MessageListProps) {
    const { messages, isLoading, error } = useMessages(roomId);
    const { user } = useAuthStore();
    const endRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-red-500">Failed to load messages</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
            {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
            ) : (
                messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwn={message.author.id === user?.id}
                    />
                ))
            )}
            <div ref={endRef} />
        </div>
    );
}
