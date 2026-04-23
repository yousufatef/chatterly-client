'use client';

import { usePresence } from '@/hooks/usePresence';

interface RoomHeaderProps {
    roomId: string;
    roomName: string;
}

export function RoomHeader({ roomId, roomName }: RoomHeaderProps) {
    const { onlineUsers } = usePresence(roomId);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div>
                <h1 className="font-bold text-lg">#{roomName}</h1>
                <p className="text-xs text-gray-500">
                    {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} online
                </p>
            </div>
        </div>
    );
}
