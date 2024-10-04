import Grid from "@mui/material/Grid";
import { Box, Typography, Button,Paper } from "@mui/material";
import { useTranslation } from 'react-i18next';

const Home = () =>  {
  const { t } = useTranslation(['index']);

  return (
    <>
      <Box sx={{ minHeight: '100vh', paddingX: '7vw', bgcolor: 'background.default', paddingTop:'10vh', transition: "background-color 1.5s ease-in-out, color 1.5s ease-in-out"}}>
        <main>
          <Paper sx={{marginX:'4vw',paddingX: '8vw', paddingY:'10vh', transition: 'background-color 1.5s ease-in-out'}}>
          <Grid container wrap="nowrap" direction="row" alignItems="center" justifyContent="space-around">
            <Grid item size={{xs:12, md:4}}>
              <Typography text variant="h3" gutterBottom>
                {t('welcome')}
              </Typography>
              <Typography>
                {t('description')}
              </Typography>
              <Button href='/login' variant="contained" sx={{ color:'#ffffff', backgroundColor:'#2da14c', marginTop: '3rem' }}>
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
          </Paper>
          <Paper sx={{marginX:'4vw',paddingX: '8vw', paddingY:'8vh', marginTop:'5vh', marginBottom:'10vh', transition: 'background-color 1.5s ease-in-out'}}>
          <Typography variant="h4" gutterBottom sx={{ marginBottom: '5rem', fontWeight: 'bold', textAlign: 'center' }}>
            {t('model')}
          </Typography>
          <Grid container wrap="nowrap" direction="row" alignItems="top" justifyContent="space-around" spacing={10}>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{textDecoration:'underline'}}>{t('arimaModel')}</Typography>
              <br/>
              <Typography>
                {t('arimaDescription')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{textDecoration:'underline'}}>{t('garchModel')}</Typography>
              <br/>
              <Typography>
                {t('garchDescription')}
              </Typography>
            </Grid>
          </Grid>
          </Paper>
        </main>
      </Box>
    </>
  );
}

export default Home;
