import { apiFetch } from './client';


export function login(email: string, password: string) {
    return apiFetch<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}


export function signup(email: string, password: string) {
    return apiFetch<{ accessToken: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}