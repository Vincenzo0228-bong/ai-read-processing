import { useEffect, useState } from 'react';
import { getLeads, createLead } from '../api/leads';
import LeadList from './LeadList';
import LeadModal from './LeadModal';
import { Box, Button, Typography, Paper, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../state/authStore';
import { useNavigate } from 'react-router-dom';

export type Lead = {
	id: string;
	name: string;
	contactChannel?: string;
	contact_channel?: string;
	message: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
	steps?: {
		name: string;
		status: 'not_started' | 'processing' | 'completed' | 'failed' | 'skipped';
		error?: string;
	}[];
};

export default function Dashboard() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [open, setOpen] = useState(false);
	const setToken = useAuthStore((s) => s.setToken);
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	// Decode email from JWT (if present)
	let email = '';
	if (token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			email = payload.email || '';
		} catch (err) {
			console.error('Failed to decode JWT:', err);
			email = '';
		}
	}

	function logout() {
		setToken(null);
		navigate('/login');
	}


	async function load() {
		setLeads(await getLeads());
	}

	useEffect(() => {
		const fetchLeads = async () => {
			await load();
		};
		fetchLeads();
	}, []);

	// Optimistically add new lead
	async function handleNewLead(data: { name: string; contact_channel: string; message: string }) {
		const tempId = 'temp-' + Math.random().toString(36).slice(2);
		setLeads((prev) => [
			{
				id: tempId,
				name: data.name,
				contactChannel: data.contact_channel,
				message: data.message,
				status: 'pending',
				steps: [],
			},
			...prev,
		]);
		await createLead(data);
		load();
	}

	return (
		<Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', width: '100vw', p: 0, m: 0, display: 'flex', flexDirection: 'column' }}>
			<Paper elevation={3} sx={{ flex: 1, p: 3, m: 0, borderRadius: 0, minHeight: '100vh', width: '100vw', boxSizing: 'border-box' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant="h4">Leads Dashboard</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
							{email}
						</Typography>
						<IconButton color="primary" onClick={logout} title="Logout">
							<LogoutIcon />
						</IconButton>
						<Button variant="contained" onClick={() => setOpen(true)}>
							New Lead
						</Button>
					</Box>
				</Box>
				<LeadList leads={leads} />
				{open && <LeadModal onClose={() => setOpen(false)} onSubmit={handleNewLead} />}
			</Paper>
		</Box>
	);
}