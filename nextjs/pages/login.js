import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Grid, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      });
        localStorage.setItem('email', email);
        localStorage.setItem('token', response.data.access_token);
        console.log('2FA required');
        router.push('/2fa');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: '2rem', marginBottom: '2rem' }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body1" style={{ marginRight: '0.5rem' }}>
            Don't have an account?
          </Typography>
          <Link href="/signup" passHref>
            <Button variant="text" style={{ color: '#68BB59' }}>
              Sign Up
            </Button>
          </Link>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
