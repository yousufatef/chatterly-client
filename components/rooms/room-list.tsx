'use client';

import { useRooms } from '@/hooks/useRooms';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/button';

export function RoomList() {
    const { rooms, isLoading } = useRooms();
    const { activeRoomId, setActiveRoom } = useUIStore();

    if (isLoading) {
        return <div className="p-4 text-sm text-gray-500">Loading rooms...</div>;
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Rooms</h2>

            {rooms.length === 0 ? (
                <p className="text-xs text-gray-500">No rooms available</p>
            ) : (
                rooms.map((room) => (
                    <Button
                        key={room.id}
                        variant={activeRoomId === room.id ? 'default' : 'outline'}
                        className="justify-start text-left truncate"
                        onClick={() => setActiveRoom(room.id)}
                    >
                        # {room.name}
                    </Button>
                ))
            )}
        </div>
    );
}
