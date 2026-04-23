'use client';

import { useState, useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useTyping } from '@/hooks/useTyping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface MessageInputProps {
    roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
    const [content, setContent] = useState('');
    const { sendMessage, isSending } = useMessages(roomId);
    const { startTyping, stopTyping, typingUsers } = useTyping(roomId);  // Fixed: removed unused 'error' variable
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleTyping = () => {
        startTyping();

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 3000);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Message cannot be empty');
            return;
        }

        try {
            sendMessage({ content: content.trim(), roomId });
            setContent('');
            stopTyping();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            toast.error('Failed to send message');
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            {typingUsers.length > 0 && (
                <p className="text-xs text-gray-500">
                    {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </p>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="flex-1"
                />
                <Button type="submit" disabled={isSending || !content.trim()}>
                    {isSending ? 'Sending...' : 'Send'}
                </Button>
            </form>
        </div>
    );
}
