import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios'; // Import axios to make API calls

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Track edit mode for each field
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    // Assuming username and email are stored in localStorage
    setUsername(localStorage.getItem('username'));
    setEmail(localStorage.getItem('email'));
  }, []);

  const handleAvatarChange = () => {
    // Add API call for changing avatar here
    console.log('Change avatar');
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

  // Function to update username
  const updateUsername = async () => {
    try {
      const response = await axios.put('/api/update-username', { username });
      console.log('Username updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  // Function to update email
  const updateEmail = async () => {
    try {
      const response = await axios.put('/api/update-email', { email });
      console.log('Email updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  // Function to update password
  const updatePassword = async () => {
    // Validate password before calling the API
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put('/api/update-password', { password });
      console.log('Password updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating password:', error);
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
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!isUsernameEditable} // Disable unless editable
        />
        <IconButton
          onClick={() => {
            if (isUsernameEditable) updateUsername();
            setIsUsernameEditable(!isUsernameEditable);
          }}
        >
          {isUsernameEditable ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Email Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEmailEditable} // Disable unless editable
        />
        <IconButton
          onClick={() => {
            if (isEmailEditable) updateEmail();
            setIsEmailEditable(!isEmailEditable);
          }}
        >
          {isEmailEditable ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* New Password Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="New Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          disabled={!isPasswordEditable} // Disable unless editable
          error={!!passwordError}
          helperText={passwordError}
        />
        <IconButton
          onClick={() => {
            if (isPasswordEditable) updatePassword();
            setIsPasswordEditable(!isPasswordEditable);
          }}
        >
          {isPasswordEditable ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Confirm Password Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          disabled={!isPasswordEditable} // Disable unless editable
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{ width: 'calc(100% - 40px)' }}
        />
      </Box>

    </Box>
  );
};

export default AccountSettings;
