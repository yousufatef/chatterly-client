import { User } from './user.types';

export interface Room {
    id: string;
    name: string;
    description?: string;
    members: User[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface RoomCreateInput {
    name: string;
    description?: string;
}
