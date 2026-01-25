import { useState } from 'react';
import { signup } from '../api/auth';
import { useAuthStore } from '../state/authStore';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Avatar, Stack } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export default function Signup() {
	const setToken = useAuthStore((s) => s.setToken);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const navigate = useNavigate();

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}
		const res = await signup(email, password);
		setToken(res.accessToken);
		navigate('/');
	}
    function goToLogin() {
		navigate('/login');
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
						<PersonAddAltIcon />
					</Avatar>
					<Typography component="h1" variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
						Signup
					</Typography>
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
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Confirm Password"
							type="password"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2, justifyContent: 'center' }}>
							<Button
								variant="contained"
								color="primary"
                                onClick={goToLogin}
							>
								Login
							</Button>
							<Button
                                type="submit"
                                color="secondary"
                                variant="outlined"
                            >
                                Register
                            </Button>
						</Stack>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}