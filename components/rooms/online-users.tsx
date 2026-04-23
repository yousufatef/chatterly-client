'use client';

import { usePresence } from '@/hooks/usePresence';

interface OnlineUsersProps {
    roomId: string;
}

export function OnlineUsers({ roomId }: OnlineUsersProps) {
    const { onlineUsers } = usePresence(roomId);

    return (
        <div className="w-60 border-l border-gray-200 dark:border-gray-700 p-4 hidden lg:flex flex-col">
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">
                Online Users
            </h2>

            <div className="space-y-2 overflow-y-auto flex-1">
                {onlineUsers.length === 0 ? (
                    <p className="text-xs text-gray-500">No users online</p>
                ) : (
                    onlineUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${user.status === 'online'
                                        ? 'bg-green-500'
                                        : user.status === 'away'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-400'
                                    }`}
                            />
                            <span className="text-sm truncate">{user.username}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
