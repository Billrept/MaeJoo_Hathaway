import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Grid from "@mui/material/Grid2";
import { Box, Typography, Button, TextField } from "@mui/material"; // Use by LoginForm
import useBearStore from "@/store/useBearStore";

function Home() {
  return (
    <>

      <main>
        <Grid
        container
        rowSpacing={2}
        style={{ minHeight: '100vh', padding:'15vw' }}
        alignItems="center"
        justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <Box sx={{ padding: '2rem' }}>
              <Typography variant="h2" gutterBottom>
                Some cool text here
              </Typography>
              <Typography variant="body1" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
              <Button
              href='/login'
                variant="contained"
                color="primary"
                sx={{ backgroundColor: '#68BB59', marginTop: '1rem' }}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ justifyContent: 'center', padding: '2rem' }}>
              <img
                src="/images/placeholder.jpg"
                alt="Very very cool image of something"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Box>
          </Grid>
          <Grid item size={12}>
            <Typography variant='h4'gutterBottom style={{marginTop:'5rem', marginBottom:'5rem'}}>
              Prediction Models
            </Typography>
          </Grid>
          <Grid container sx={{direction:'row', justifyContent:'space-evenly', alignItems:'center'}}>
            <Grid item xs={12} md={6}>
              <Typography level='body-md'>
                ARIMA
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography level='body-md'>
              GARCH
            </Typography>
          </Grid>
        </Grid>
      </main>
    </>
  );
}

export default Home;
