import { Message } from './message.types';
import { User } from './user.types';

/**
 * All socket event strings come from @your-github-username/chatterly-types
 * This is a local mirror for type safety
 */

// Message events
export interface MessageSentPayload {
    message: Message;
}

export interface MessageUpdatedPayload {
    message: Message;
}

export interface MessageDeletedPayload {
    messageId: string;
    roomId: string;
}

// Typing events
export interface TypingStartPayload {
    userId: string;
    username: string;
    roomId: string;
}

export interface TypingStopPayload {
    userId: string;
    roomId: string;
}

// Presence events
export interface UserJoinedPayload {
    user: User;
    roomId: string;
}

export interface UserLeftPayload {
    userId: string;
    roomId: string;
}

export interface PresenceUpdatePayload {
    userId: string;
    status: 'online' | 'offline' | 'away';
    roomId: string;
}

// Socket event map for type safety
export interface SocketEventMap {
    'message:sent': MessageSentPayload;
    'message:updated': MessageUpdatedPayload;
    'message:deleted': MessageDeletedPayload;
    'typing:start': TypingStartPayload;
    'typing:stop': TypingStopPayload;
    'user:joined': UserJoinedPayload;
    'user:left': UserLeftPayload;
    'presence:update': PresenceUpdatePayload;
}
