import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useBearStore from '@/store/useBearStore'; // Assuming you're using Zustand

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const router = useRouter();

  const isDarkMode = useBearStore((state) => state.isDarkMode);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); // Replace with the page you want to redirect to
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('email', email);
      localStorage.setItem('username', response.data.username);
      console.log("response: ",response.data);
      router.push('/2fa');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#333' : '#f5f5f5', 
        transition:"background-color 1.5s ease-in-out, color 1.5s ease-in-out"
      }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper
          elevation={5}
          sx={{
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: isDarkMode ? '#424242' : '#fff', 
            color: isDarkMode ? '#ffffff' : '#000000', 
            transition :"background-color 1.5s ease-in-out, color 1.5s ease-in-out"
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
                  color: isDarkMode ? '#ffffff' : '#000000', 
                },
              }}
              InputLabelProps={{
                style: {
                  color: isDarkMode ? '#cccccc' : '#000000', 
                },
              }}
            />

            {/* Password Field with visibility toggle */}
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                style: {
                  color: isDarkMode ? '#ffffff' : '#000000',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end" sx={{marginRight:'5px'}}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
