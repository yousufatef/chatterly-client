# AGENTS.md — chatterly-client

## Purpose
Next.js 14 (App Router) frontend. Real-time chat UI.

## Key rules
1. Server state (messages, rooms, users) → React Query only. No Zustand for server data.
2. UI state (sidebar open, active modal) → Zustand only. No React Query for UI state.
3. All socket event strings come from `@your-github-username/chatterly-types`.
4. The socket instance is a singleton in `src/lib/socket.ts` — never create a new socket in a component.
5. Use optimistic updates for message sends — never wait for server confirmation before showing the message.

## Route groups
(auth) — login, register. No sidebar. Redirects to /chat if already logged in.
(chat) — all chat routes. Has sidebar layout. Redirects to /login if not authenticated.

## State flow
API calls → lib/api.ts (axios instance with interceptors) → React Query hooks → components
Real-time → lib/socket.ts → custom hooks (useMessages, useTyping, usePresence) → components

## Environment variables
NEXT_PUBLIC_API_URL — server REST base URL
NEXT_PUBLIC_SOCKET_URL — server socket URL