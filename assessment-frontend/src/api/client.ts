const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');


    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });


    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }


    return res.json();
}