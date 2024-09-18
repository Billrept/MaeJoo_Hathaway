import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Grid from "@mui/material/Grid2";
import { Box, Typography, Button, TextField } from "@mui/material"; // Use by LoginForm
import useBearStore from "@/store/useBearStore";

function Home() {
  return (
    <>

      <main style={{paddingLeft:'15vw', paddingRight:'15vw'}}>
        <Grid container wrap="nowrap" direction='row' alignItems="center" justifyContent="space-around" marginTop='8rem'>

          <Grid item size={{ xs:12, md:6 }}>
              <Typography variant="h2" gutterBottom>
                Some cool text here
              </Typography>
              <Typography variant="body1" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
              <Button href='/login' variant="contained" color="primary" sx={{ backgroundColor: '#68BB59', marginTop: '1rem' }} >
                Get Started
              </Button>
          </Grid>

          <Grid item size={{ xs:12, md:6 }}>
            <Box sx={{ justifyContent: 'center', padding: '2rem' }}>
              <img
                src="/images/placeholder.jpg"
                alt="Very very cool image of something"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Box>
          </Grid>
        </Grid>
        <Typography variant='h4'gutterBottom style={{marginTop:'10rem', marginBottom:'5rem'}} sx={{fontWeight:'bold'}}>Prediction Models</Typography>
        <Grid container wrap="nowrap" direction='row' alignItems="center" justifyContent="space-around">
            <Grid item size={{xs:12, md:6}} sx={{ textAlign:'center'}}>
              <Typography variant='h6'>ARIMA MODEL</Typography>
              <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Grid>
            <Grid item size={{xs:12, md:6}} sx={{ textAlign:'center'}}>
              <Typography variant='h6'>GARCH MODEL</Typography>
              <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Grid>
        </Grid>
      </main>
    </>
  );
}

export default Home;
