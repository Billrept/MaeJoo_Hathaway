import { Box, Typography, Grid, Link } from '@mui/material';
import useBearStore from "@/store/useBearStore";

const FooterLayout = () => {
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDarkMode ? "#333" : "#68BB59",
        padding: '1.5rem 0',
        textAlign: 'center',
        color: 'white',
        marginTop:'10vh'
      }}
    >
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">© 2024 Maejoo Hathaway</Typography>
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
