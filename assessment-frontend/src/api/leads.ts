import { apiFetch } from './client';
import type { Lead } from '../dashboard/Dashboard';


export function createLead(data: {
    name: string;
    contact_channel: string;
    message: string;
}) {
    return apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function getLeads() {
    return apiFetch<Lead[]>('/leads');
}

export function getLead(id: string) {
    return apiFetch<Lead>(`/leads/${id}`);
}