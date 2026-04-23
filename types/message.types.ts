import { User } from './user.types';

export interface Message {
    id: string;
    content: string;
    roomId: string;
    author: User;
    createdAt: Date;
    updatedAt?: Date;
}

export interface MessageInput {
    content: string;
    roomId: string;
}
