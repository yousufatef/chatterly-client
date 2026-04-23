'use client';

import { useUIStore } from '@/store/ui.store';
import { useRooms } from '@/hooks/useRooms';
import { RoomHeader } from '@/components/rooms/room-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { OnlineUsers } from '@/components/rooms/online-users';

export default function ChatPage() {
    const { activeRoomId } = useUIStore();
    const { rooms } = useRooms();

    const activeRoom = rooms.find((r) => r.id === activeRoomId);

    if (!activeRoomId) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a room to start chatting</p>
            </div>
        );
    }

    if (!activeRoom) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Room not found</p>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col">
                <RoomHeader roomId={activeRoom.id} roomName={activeRoom.name} />
                <MessageList roomId={activeRoom.id} />
                <MessageInput roomId={activeRoom.id} />
            </div>

            <OnlineUsers roomId={activeRoom.id} />
        </div>
    );
}
