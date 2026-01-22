import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../state/authStore';
import { Box, Button, TextField, Typography, Paper, Avatar, Stack, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {	
    const setToken = useAuthStore((s) => s.setToken);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		try {
			const res = await login(email, password);
			setToken(res.accessToken);
			navigate('/');
		} catch (err: any) {
			let msg = 'Login failed. Please try again.';
			try {
				const parsed = JSON.parse(err.message);
				if (parsed && parsed.message) msg = parsed.message;
			} catch {}
			setError(msg);
		}
	}

	function goToSignup() {
		navigate('/signup');
	}

	return (
		<Box sx={{
			minHeight: '100vh',
			width: '100vw',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'relative',
			overflow: 'hidden',
			backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}}>
			<Box sx={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				bgcolor: 'rgba(0,0,0,0.5)',
				zIndex: 0,
			}} />
			<Paper elevation={6} sx={{ p: 4, maxWidth: 350, width: '100%', zIndex: 1, position: 'relative' }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
						Login
					</Typography>
					{error && (
						<Alert severity="error" sx={{ width: '100%', mb: 2 }}>
							{error}
						</Alert>
					)}
					<Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Email"
							type="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2, justifyContent: 'center' }}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
							>
								Login
							</Button>
							<Button
								variant="outlined"
								color="secondary"
								onClick={goToSignup}
							>
								Sign Up
							</Button>
						</Stack>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}
