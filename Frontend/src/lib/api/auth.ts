import { fetchApi } from './core';

// Check authentication status
export const getMe = () => fetchApi<AuthResponse>('/auth/me', {
    method: 'GET',
});

export const loginUser = (credentials: LoginCredentials) => fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
});

export const registerUser = (userData: RegistrationCredentials) => fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});

export const logoutUser = () => fetchApi('/auth/logout', { 
    method: 'POST',
});


type LoginCredentials = {
    email: string,
    password: string
};
type RegistrationCredentials = {
    name: string,
    email: string,
    password: string,
    role: string
};
type AuthResponse = {
    name: string,
    email: string,
    role: string
};
