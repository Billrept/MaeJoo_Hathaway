import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setEmail(localStorage.getItem('email'));
  }, []);

  const handleAvatarChange = () => {
    // Add API call here
    console.log('Change avatar');
  };

  const handleUserChange = () => {
    // Validate password and confirm password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    //Add API call here
    console.log('handleUserChange');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 8) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value) {
      setConfirmPasswordError('');
    }
  };

  return (
    <Box sx={{ maxWidth: '500px', padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>

      {/* Account Circle with Edit Button */}
      <Box sx={{ display: 'flex', marginBottom: '16px' }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#68BB59',
          }}
        />
        <IconButton onClick={handleAvatarChange} sx={{ marginLeft: '20px' }}>
          <EditIcon />
        </IconButton>
      </Box>

      {/* Username Field */}
      <Box sx={{ marginBottom: '16px' }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>

      {/* Email Field */}
      <Box sx={{ marginBottom: '16px' }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      {/* New Password Field */}
      <Box sx={{ marginBottom: '16px' }}>
        <TextField
          fullWidth
          label="New Password"
          variant="outlined"
          placeholder="New Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
        />
      </Box>

      {/* Confirm Password Field */}
      <Box sx={{ marginBottom: '16px' }}>
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: '16px' }}
        onClick={handleUserChange}
      >
        Save
      </Button>
    </Box>
  );
};

export default AccountSettings;
