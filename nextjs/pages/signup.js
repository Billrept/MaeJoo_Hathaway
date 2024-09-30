import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const { t } = useTranslation(['signup']);

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
    
    if (!emailRegex.test(email)){
      setEmailError("Please enter a valid email address");
      return;
    }

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
        localStorage.setItem('fromSignup', true);
        router.push('/redirecting');
      }
      catch (err) {
      if (err.response && err.response.data && err.response.data.detail === 'User with this email already exists') {
        setError('A user with this email already exists. Please use a different email or log in.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', padding: '0 20px' }}>
      <Paper elevation={5} style={{ padding: '40px', maxWidth: '450px', borderRadius: '15px', width: '100%' }}>
        <Grid container direction="column" spacing={3}>
          <Grid item align="center">
            <AccountCircleIcon fontSize="large" color="primary" />
            <Typography variant="h4" gutterBottom>
              {t('title')}
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label={t('username')}
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label={t('email')}
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label={t('password')}
              type={showPassword ? "text" : "password"}
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
                      onClick={() => setShowPassword(!showPassword)}
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
              label={t('confirmPassword')}
              type={showConfirmPassword ? "text" : "password"}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              style={{ padding: '10px 0', fontSize: '16px' }}
            >
              {t('signupButton')}
            </Button>
          </Grid>
          <Grid item>
            <Typography align="center">
              {t('ctaText')} <Link href="/login">{t('link')}</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Signup;
