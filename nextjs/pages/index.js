import Grid from "@mui/material/Grid";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

const Home = () =>  {
  const { t } = useTranslation(['index']);

  return (
    <>
      <Box sx={{ minHeight: '100vh', paddingLeft: '15vw', paddingRight: '15vw', bgcolor: 'background.default', paddingTop:'10vh', transition: "background-color 1.5s ease-in-out, color 1.5s ease-in-out"}}>
        <main>
          <Grid container wrap="nowrap" direction="row" alignItems="center" justifyContent="space-around">
            
            <Grid item size={{xs:12, md:4}}>
              <Typography text variant="h2" gutterBottom>
                {t('welcome')}
              </Typography>
              <Typography text variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
              <Button href='/login' variant="contained" sx={{ color:'#ffffff', backgroundColor:'#2da14c', marginTop: '1rem' }}>
                {t('button')}
              </Button>
            </Grid>

            <Grid item size={{xs:12, md:8}}>
              <Box sx={{ justifyContent: 'center', padding: '2rem' }}>
                <img
                  src="/images/placeholder.jpg"
                  alt="Very cool image of something"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </Box>
            </Grid>

          </Grid>

          <Typography variant="h4" gutterBottom sx={{ marginTop: '10rem', marginBottom: '5rem', fontWeight: 'bold' }}>
            Prediction Models
          </Typography>

          <Grid container wrap="nowrap" direction="row" alignItems="center" justifyContent="space-around">
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Typography variant="h6">ARIMA MODEL</Typography>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Typography variant="h6">GARCH MODEL</Typography>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
            </Grid>
          </Grid>
        </main>
      </Box>
    </>
  );
}

export default Home;
