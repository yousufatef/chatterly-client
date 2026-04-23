import { io, Socket } from 'socket.io-client';

/**
 * Singleton socket instance for real-time communication
 * CRITICAL RULE: Never create a new socket in a component
 * Always import this singleton instance
 */

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socketInstance && typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

        socketInstance = io(socketUrl, {
            auth: {
                token,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance?.id);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    return socketInstance as Socket;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};

export default getSocket;
