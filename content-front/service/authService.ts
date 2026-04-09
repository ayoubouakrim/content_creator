import { AuthResponse, UserLogin, UserRegister } from '@/types/auth';


export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(err.message || 'An error occurred');
    }

    return response.json();
}

export const authService = {
    login: (credentials: UserLogin) => request<AuthResponse>('/auth/login', credentials),
    register: (payload: UserRegister) => request<AuthResponse>('/auth/register', payload),
};