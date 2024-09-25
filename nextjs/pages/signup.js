import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(""); // Ensure this state is for email
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setPasswordValid(false);
    } else {
      setPasswordError('');
      setPasswordValid(true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

	try {
	  const response = await axios.post('http://localhost:8000/auth/signup', {
		email,
		username,
		password
	  });

	  if (response.data.success && response.data['2fa_required']) {
		localStorage.setItem('email', email);
		router.push('/2fa');
	  } else if (response.data.success) {
		router.push('/dashboard');
	  } else {
		setError('Sign up failed. Please try again.');
	  }
	} catch (err) {
	  setError('Sign up failed. Please try again.');
	}
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h5" align="center">
            <AccountCircleIcon fontSize="large" />
            Sign Up
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {error && (
          <Grid item>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            disabled={!passwordValid}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item>
          <Typography align="center">
            Already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Signup;
