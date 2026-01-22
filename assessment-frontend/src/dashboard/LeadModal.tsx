import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';


export default function LeadModal({ onClose, onSubmit }: {
	onClose: () => void;
	onSubmit: (data: { name: string; contact_channel: string; message: string }) => Promise<void>;
}) {
	const [name, setName] = useState('');
	const [channel, setChannel] = useState('webchat');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await onSubmit({ name, contact_channel: channel, message });
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
				onClose();
			}, 1200);
		} catch (err: any) {
			setError(err?.message || 'Failed to submit lead');
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Dialog open onClose={onClose} maxWidth="xs" fullWidth>
				<DialogTitle>New Lead</DialogTitle>
				<form onSubmit={submit}>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							label="Name"
							type="text"
							fullWidth
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loading}
						/>
						<TextField
							select
							margin="dense"
							label="Contact Channel"
							fullWidth
							value={channel}
							onChange={(e) => setChannel(e.target.value)}
							sx={{ mt: 2 }}
							disabled={loading}
						>
							<MenuItem value="webchat">Webchat</MenuItem>
							<MenuItem value="whatsapp">WhatsApp</MenuItem>
							<MenuItem value="email">Email</MenuItem>
							<MenuItem value="other">Other</MenuItem>
						</TextField>
						<TextField
							margin="dense"
							label="Message"
							type="text"
							fullWidth
							multiline
							minRows={3}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							sx={{ mt: 2 }}
							disabled={loading}
						/>
						{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose} disabled={loading}>Cancel</Button>
						<Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
							{loading ? 'Submitting...' : 'Submit'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<Snackbar open={success} autoHideDuration={1200} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert severity="success" sx={{ width: '100%' }}>
					Lead submitted successfully!
				</Alert>
			</Snackbar>
		</>
	);
}