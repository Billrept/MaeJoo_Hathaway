import { Box, Typography, Grid, Link } from '@mui/material';

const FooterLayout = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#68BB59',
        padding: '1.5rem 0',
        marginTop: '5rem',
        textAlign: 'center',
        color: 'white'
      }}
    >
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">© 2024 My Application</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link href="/about" underline="hover" sx={{ color: 'white' }}>
            About Us
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link href="/contact" underline="hover" sx={{ color: 'white' }}>
            Contact
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterLayout;
