import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '@/context/auth';  // Import useAuth hook

const TwoFactorAuth = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const router = useRouter();
  const { login } = useAuth();  // Destructure the login function from useAuth

  useEffect(() => {
    // Check for both email and authentication token
    const storedEmail = localStorage.getItem('email');
    const authToken = localStorage.getItem('token'); 
    if (!storedEmail || !authToken) {
      setError('Unauthorized access, redirecting to login...');
      router.push('/login');  
    } else {
      setEmail(storedEmail);

      // Fetch the reference code from the backend when the page loads
      fetchReferenceCode(storedEmail);
    }
  }, [router]);

  const fetchReferenceCode = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/auth/get-reference-code/${email}`);
      setReferenceCode(response.data.reference_code);
    } catch (error) {
      console.error('Error fetching reference code:', error);
      setError('Could not retrieve reference code.');
    }
  };

  const resendCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/resend-otp', { email });
      setSuccess('OTP has been resent successfully.');
      fetchReferenceCode(email);  // Fetch the updated reference code
      setError('');
    } catch (error) {
      setError('Failed to resend code. Please try again.');
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

      console.log(response.data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token);
        setSuccess('OTP verified successfully!');
        
        // Call login to set isLoggedIn to true
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        login(userId, token);  // Trigger login after successful OTP verification
        
        router.push('/dashboard');  
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err.response);
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

          {/* Display Reference Code */}
          {referenceCode && (
            <Typography variant="body1" gutterBottom color="primary">
              Reference Code: {referenceCode}
            </Typography>
          )}

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
              disabled={!email}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#68BB59', color:"#ffffff" }}
              disabled={!email}
            >
              Verify
            </Button>

            <Typography variant="body1" gutterBottom>
              Need a new code? 
              <Button
                variant="text"
                onClick={resendCode}
                style={{ color: '#68BB59' }}
                disabled={!email}
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