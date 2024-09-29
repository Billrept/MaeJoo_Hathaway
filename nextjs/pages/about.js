import React from 'react';
import { Grid, Box, Typography, Avatar, Paper } from '@mui/material';

const teamMembers = [
  {
    name: 'Member 1',
    description: 'Member 1 is the project lead and expert in frontend development.',
    image: '/images/member1.jpg',
  },
  {
    name: 'Member 2',
    description: 'Member 2 specializes in backend development and database management.',
    image: '/images/member2.jpg',
  },
  {
    name: 'Member 3',
    description: 'Member 3 focuses on UI/UX design and user interaction.',
    image: '/images/member3.jpg',
  },
  {
    name: 'Member 4',
    description: 'Member 4 is in charge of DevOps and cloud infrastructure.',
    image: '/images/member4.jpg',
  },
];

const AboutUs = () => {
  return (
    <Box sx={{ minHeight: '100vh', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom align="center">
        About Us
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center', transition: "background-color 1.5s ease-in-out, color 1.5s ease-in-out" }}>
              <Avatar
                alt={member.name}
                src={member.image}
                sx={{ width: 150, height: 150, margin: '0 auto 1rem auto' }}
              />
              <Typography variant="h5" gutterBottom>
                {member.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {member.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutUs;
