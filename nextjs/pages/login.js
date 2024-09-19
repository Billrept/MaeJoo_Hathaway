import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoginIcon from '@mui/icons-material/Login';
import Link from "next/link";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', { 
		username, password 
	});
      if (response.data.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign:'center'}}>
            <LoginIcon sx={{fontSize: 80, marginBottom:'2rem'}}/>
            <Typography text variant="h4" gutterBottom>
                Log in
            </Typography>
            <Typography variant="body1">
                Welcome user, please login to continue
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{marginTop:'2rem'}}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '2rem',marginBottom: '2rem' , backgroundColor:'#68BB59'}}>
                    Log in
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
