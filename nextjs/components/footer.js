import { Box, Typography, Grid, Link } from '@mui/material';
import useBearStore from "@/store/useBearStore";
import { useTranslation } from 'react-i18next';

const FooterLayout = () => {
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  const { t } = useTranslation(['aboutUs']);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDarkMode ? "#333" : "#68BB59",
        padding: '1.5rem 0',
        textAlign: 'center',
        color: 'white',
        marginTop: 'auto'  // Ensures footer sticks to bottom
      }}
    >
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">© 2024 Maejoo Hathaway</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="/about" underline="hover" sx={{ color: 'white' }}>
            {t('title')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterLayout;
