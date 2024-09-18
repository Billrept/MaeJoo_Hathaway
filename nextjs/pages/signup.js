import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword_hash] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validatePassword = (password) => {
    const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRequirements.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword_hash(newPassword);

    if (!validatePassword(newPassword)) {
      setPasswordValid(false);
      setPasswordError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter and a number.');
    } else {
      setPasswordValid(true);
      setPasswordError('');
    }

    if (confirmPassword && confirmPassword !== newPassword) {
        setConfirmPasswordError('Passwords do not match.');
      } else {
        setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword !== password_hash) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
        setError('Please fix the password issues.');
        return;
    }

    if (password_hash !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
        return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users', {
        username: username,
        password_hash: password_hash,
        email: email,
      });
      if (response.data.success) {
        console.log("User created successfully")
        // router.push('/login');
      } else {
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
            <AccountCircleIcon sx={{fontSize: 80, marginBottom:'2rem'}}/>
            <Typography variant="h4" gutterBottom>
                Create Account
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                Please fill in the details to create an account
            </Typography>
            <form onSubmit={handleSignup}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password_hash}
                    onChange={handlePasswordChange}
                    required
                    helperText={passwordError || ' '}
                    error={Boolean(passwordError)}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    helperText={confirmPasswordError || ' '}
                    error={Boolean(confirmPasswordError)}
                />
                {error && <Typography color="error" style={{ marginTop: '1rem' }}>{error}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '2rem', marginBottom:'2rem', backgroundColor:'#68BB59'}}
                    disabled={!passwordValid || !!confirmPasswordError}>
                    Sign Up
                </Button>
            </form>
            <Typography variant="body1">
              Already have an account?
            </Typography>
            <Link href="/login" passHref>
              <Button variant="text" style={{ color: '#68BB59' }}>
                Sign In
              </Button>
            </Link>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Signup;
