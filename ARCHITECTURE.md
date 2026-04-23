# Chatterly Client - Complete Architecture

## 🏗️ Project Architecture

### State Management Flow
```
┌─ Server State (React Query)
│  ├─ Messages: useMessages(roomId)
│  ├─ Rooms: useRooms()
│  └─ Cached via queryClient with 5min stale time
│
├─ UI State (Zustand)
│  ├─ Auth: useAuthStore (persisted)
│  └─ UI: useUIStore (ephemeral)
│
└─ Real-time State (Socket.io)
   ├─ Messages: message:sent, message:deleted
   ├─ Typing: typing:start, typing:stop
   └─ Presence: user:joined, user:left, presence:update
```

## 📁 Directory Structure

```
app/
├── layout.tsx (Root layout with Providers)
├── page.tsx (Redirect to /chat or /login)
├── providers.tsx (React Query + Toast)
├── (auth)/
│   ├── layout.tsx (Auth routes wrapper)
│   ├── login/page.tsx
│   └── register/page.tsx
└── (chat)/
    ├── layout.tsx (Chat routes wrapper with auth guard)
    └── page.tsx (Main chat UI)

components/
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── auth-guard.tsx
├── chat/
│   ├── sidebar.tsx (Navigation + user info + logout)
│   ├── message-item.tsx (Single message bubble)
│   ├── message-list.tsx (Scrollable message container)
│   ├── message-input.tsx (Input + send + typing indicator)
│   └── chat-layout.tsx (Main layout wrapper)
├── rooms/
│   ├── room-list.tsx (Room selector)
│   ├── room-header.tsx (Room title + online count)
│   └── online-users.tsx (Presence sidebar)
└── ui/
    ├── button.tsx (Radix UI button)
    └── input.tsx (Styled input)

hooks/
├── useSocket.ts (Singleton socket ref)
├── useMessages.ts (React Query messages + optimistic updates)
├── useRooms.ts (React Query rooms)
├── useTyping.ts (Socket typing indicators)
└── usePresence.ts (Socket user presence)

lib/
├── api.ts (Axios with auth interceptors)
├── socket.ts (Singleton socket instance)
├── queryClient.ts (React Query config)
└── utils.ts (cn helper)

store/
├── auth.store.ts (Zustand - persisted user/token)
└── ui.store.ts (Zustand - ephemeral UI state)

types/
├── user.types.ts
├── message.types.ts
├── room.types.ts
└── socket.events.ts
```

## 🔄 User Journey

### 1. **Unauthenticated User**
```
Visit app → Redirect to /login
├─ User enters email + password
└─ Login API call → Token saved → Redirect to /chat
```

### 2. **Authenticated User**
```
Visit app → Redirect to /chat
├─ Chat layout loaded with sidebar
├─ Room list fetched via React Query
├─ User selects room
├─ Messages loaded for room
├─ Real-time socket listeners attached
└─ Ready to send/receive messages
```

### 3. **Sending Message**
```
User types message
├─ Optimistic UI update (message appears instantly)
├─ Emit message:send via socket
├─ Remove temp message on server confirmation
└─ Typing indicator cleared
```

### 4. **Real-time Updates**
```
Socket receives event
├─ message:sent → Update React Query cache
├─ typing:start → Add user to typing list
├─ user:joined → Add to online users list
└─ presence:update → Update user status
```

## 🔐 Authentication Flow

1. **Login/Register** → API call with credentials
2. **Token Storage** → Saved to localStorage
3. **Request Interceptor** → Token added to all API calls
4. **Response Interceptor** → 401 errors redirect to /login
5. **Socket Auth** → Token passed in socket connection

## 🎨 UI Components

### Auth Pages
- Login & Register forms with validation
- Error messages inline
- Navigation between forms

### Chat Interface
- **Sidebar**: Room list, user info, logout button
- **Main Chat**: Room header + message list + input
- **Online Users**: Presence panel (desktop only)

### Responsive Design
- Mobile: Hamburger toggle for sidebar
- Tablet: Full sidebar shown
- Desktop: Full layout with online users panel

## 🔄 Real-time Features

### Typing Indicators
```
User starts typing
├─ Emit typing:start
├─ Show "User is typing..." below input
└─ Auto-stop after 3s of inactivity
```

### Presence Tracking
```
User joins room → user:joined event
├─ User added to online list
├─ Green dot indicates online status
├─ Away/offline status tracked
└─ Updates in real-time across clients
```

### Message Sync
```
Message sent
├─ Optimistically added to UI
├─ Server confirms receipt
├─ Temporary message replaced with real one
└─ Syncs across all connected clients
```

## 🚀 Performance Optimizations

- **Singleton Socket**: One connection per app
- **Optimistic Updates**: No wait for server response
- **Query Caching**: 5-minute stale time for messages/rooms
- **Ref Pattern**: Socket stored in ref, not state
- **Auto-scroll**: Smooth scroll to latest message
- **Debounced Typing**: 3-second typing indicator timeout

## 📦 Dependencies

```json
{
  "@tanstack/react-query": "React Query for server state",
  "zustand": "Lightweight state management for UI state",
  "socket.io-client": "Real-time socket communication",
  "react-hook-form": "Form validation and state",
  "zod": "Schema validation",
  "react-hot-toast": "Toast notifications",
  "lucide-react": "Icons (Menu, X for sidebar toggle)",
  "shadcn": "UI component library"
}
```

## ✅ Implementation Checklist

- ✅ Authentication with login/register
- ✅ Protected chat routes
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ User presence
- ✅ Optimistic message updates
- ✅ Responsive design
- ✅ Error handling
- ✅ Toast notifications
- ✅ Form validation
- ✅ ESLint passing
- ✅ TypeScript strict mode

## 🎯 Next Steps (Future Enhancements)

1. Add edit/delete message functionality
2. Add emoji support
3. Add file upload
4. Add user search
5. Add room creation/deletion
6. Add message search
7. Add notifications
8. Add user profiles
9. Add dark mode toggle persistence
10. Add read receipts
