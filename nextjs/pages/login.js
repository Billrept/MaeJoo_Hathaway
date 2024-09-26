import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Grid, Link } from '@mui/material';
import useBearStore from '@/store/useBearStore'; // Assuming you're using Zustand

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Get the dark mode state from the global store
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('email', email);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id);
      router.push('/2fa');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#333' : '#f5f5f5', // Dark mode background
      }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper
          elevation={5}
          sx={{
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: isDarkMode ? '#424242' : '#fff', // Dark mode background for Paper
            color: isDarkMode ? '#ffffff' : '#000000', // Text color in dark mode
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                style: {
                  color: isDarkMode ? '#ffffff' : '#000000', // Dark mode input text color
                },
              }}
              InputLabelProps={{
                style: {
                  color: isDarkMode ? '#cccccc' : '#000000', // Dark mode label color
                },
              }}
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
              InputProps={{
                style: {
                  color: isDarkMode ? '#ffffff' : '#000000',
                },
              }}
              InputLabelProps={{
                style: {
                  color: isDarkMode ? '#cccccc' : '#000000',
                },
              }}
            />
            {error && (
              <Typography
                color="error"
                sx={{ marginTop: '1rem', marginBottom: '1rem' }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                fontSize: '1rem',
              }}
            >
              Login
            </Button>
          </form>

          {/* Link to Signup */}
          <Typography sx={{ marginTop: '1rem' }}>
            Don't have an account?{' '}
            <Link href="/signup" passHref>
              <Button variant="text" color="primary">
                Sign Up
              </Button>
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
