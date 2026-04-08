export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}