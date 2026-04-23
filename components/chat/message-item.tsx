'use client';

import { Message } from '@/types/message.types';

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg ${isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    }`}
            >
                {!isOwn && <p className="text-xs font-semibold mb-1">{message.author.username}</p>}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}
