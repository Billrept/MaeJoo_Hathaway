import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const TwoFactorAuth = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');  // State to store email
  const router = useRouter();

  // Fetch email from localStorage and display error if not found
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('No email found in local storage.');
    }
  }, []);

  // Function to resend OTP code
  const resendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/resend-otp', { email });
      setSuccess('OTP has been resent successfully.');
      setError('');
    } catch (error) {
      setError('Failed to resend code. Please try again.');
      setSuccess('');
      console.error('Error resending code:', error);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/auth/verify-otp', {
        email,
        otp
      });

      console.log(response.data);  // Log the response to inspect

      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        router.push('/dashboard');  // Redirect to dashboard on success
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err.response);  // Log error response for debugging
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please enter the OTP sent to your email
          </Typography>

          {/* Display error and success messages */}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}

          {/* OTP Verification Form */}
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={!email}  // Disable if no email is available
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#68BB59', color:"#ffffff" }}
              disabled={!email}  // Disable button if email is missing
            >
              Verify
            </Button>

            <Typography variant="body1" gutterBottom>
              Need a new code? 
              <Button
                variant="text"
                onClick={resendCode}
                style={{ color: '#68BB59' }}
                disabled={!email}  // Disable resend if email is missing
              >
                Resend code
              </Button>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TwoFactorAuth;
