import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Box, Typography, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Redirecting = () => {
  const [isFromSignup, setIsFromSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fromSignup = localStorage.getItem('fromSignup');

    if (fromSignup) {
      setIsFromSignup(true);
      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem('fromSignup');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }, 1500);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Box textAlign="center">
        {isFromSignup ? (
          <Box>
            <Typography variant="h4" gutterBottom>
              User Created
            </Typography>
            {loading ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Redirecting you to login...
                </Typography>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <CheckCircleOutlineIcon style={{ color: 'green', fontSize: 50 }} />
                <Typography variant="body1">
                  Redirecting you to login...
                </Typography>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>
    </Grid>
  );
};

export default Redirecting;
