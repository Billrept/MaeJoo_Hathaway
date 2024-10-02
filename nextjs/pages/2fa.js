import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '@/context/auth';  // Import useAuth hook
import { useTranslation } from 'react-i18next';

const TwoFactorAuth = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const router = useRouter();
  const { login } = useAuth();  // Destructure the login function from useAuth
  const [username, setUsername] = useState('');  // Add username state

  const { t } = useTranslation(['2fa']);

  useEffect(() => {
    // Check for both email and authentication token
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      setError('Unauthorized access, redirecting to login...');
      router.push('/login');  
    } else {
      setEmail(storedEmail);
      fetchReferenceCode(storedEmail);
    }
  }, [router]);

  const fetchReferenceCode = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/auth/get-reference-code/${email}`);
      setReferenceCode(response.data.reference_code);
    } catch (error) {
      console.error('Error fetching reference code:', error);
      setError(t('fetchErrorText'));
    }
  };

  const resendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/resend-otp', { email });
      setSuccess(t('resendSuccessText'));
      fetchReferenceCode(email);  // Fetch the updated reference code
      setError('');
    } catch (error) {
      setError(t('resendErrorText'));
      setSuccess('');
      console.error('Error resending code:', error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/auth/verify-otp', {
        email,
        otp
      });
    
      const token = response.data.access_token;
      const user_id = response.data.user_id;
      const username = response.data.username;  // Retrieve the username from the response
    
      // Store token, user_id, and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);  // Store username properly
    
      setSuccess(t('successVerifyText'));
    
      // Log in the user
      login(user_id, token, username);
    
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Full Error Object:', err);
    
      const errorMessage = err.response && err.response.data && typeof err.response.data === 'object' 
        ? err.response.data.detail 
        : err.message || 'An error occurred during OTP verification.';
    
      console.error('Error verifying OTP:', errorMessage);
    
      setError(errorMessage);  
    }    
  };


  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('body')}
          </Typography>

          {/* Display error and success messages */}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}

          {/* Display Reference Code */}
          {referenceCode && (
            <Typography variant="body1" gutterBottom color="primary">
              {t('refCode')} {referenceCode}
            </Typography>
          )}

          {/* OTP Verification Form */}
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label={t('otpTextField')}
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={!email}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#68BB59', color:"#ffffff" }}
              disabled={!email}
            >
              {t('verifyButton')}
            </Button>

            <Typography variant="body1" gutterBottom>
              {t('ctaText')}
              <Button
                variant="text"
                onClick={resendCode}
                style={{ color: '#68BB59' }}
                disabled={!email}
              >
                {t('link')}
              </Button>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TwoFactorAuth;
