export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: Date;
}

export interface AuthUser extends User {
    token: string;
}
