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

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);  // Empty dependency array ensures this runs only once after the component mounts
 
  const resendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/resend-otp', { email });
    } catch (error) {
      setError('Failed to resend code.');
      console.error('Error resending code', error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/verify-otp', {
        email,
        otp
      });

      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        router.push('/dashboard');  // Redirect to dashboard on success
      } else {
        setError('Invalid OTP. Please try again.');
        router.reload();  // Refresh the page
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      await resendCode();  // Resend the code
      router.reload();  // Refresh the page
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
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">{success}</Typography>}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#68BB59', color:"#ffffff" }}
            >
              Verify
            </Button>
            <Typography variant="body1" gutterBottom>
                Need a new code? 
                <Link href="/resend-otp"> {/* Link to the resend OTP page */}
                    <Button variant="text" onClick={resendCode} style={{ color: '#68BB59' }}>
                        Resend code
                    </Button>
                </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TwoFactorAuth;
