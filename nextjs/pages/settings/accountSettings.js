import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation(['settings', 'common']);
  
  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setEmail(localStorage.getItem('email'));
  }, []);

  const handleAvatarChange = () => {
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
      const user_id = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:8000/auth/update-username',
        { user_id, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Username updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating username:', error.response ? error.response.data : error.message);
    }
  };

  // Function to update email
  const updateEmail = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:8000/auth/update-email',
        { user_id, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Email updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating email:', error.response ? error.response.data : error.message);
    }
  };

  const updatePassword = async () => {
    if (password.length < 8) {
      setPasswordError(t('common:passwordError'));
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t('common:confirmPasswordError'));
      return;
    }
  
    try {
      const user_id = localStorage.getItem('user_id');
      const email = localStorage.getItem('email'); // Retrieve email from localStorage or other source
      const token = localStorage.getItem('token');
  
      const payload = {
        user_id,
        email,  // Add email to the payload
        current_password: currentPassword,
        new_password: password,
      };
      
      const response = await axios.put(
        'http://localhost:8000/auth/update-password',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Password updated successfully:', response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error updating password:', error.response.data);
      } else {
        console.error('Error updating password:', error.message);
      }
    }
  };
  
  const togglePasswordVisibility = (type) => {
    if (type === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (type === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (type === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Box sx={{ maxWidth: '500px', padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        {t('settings:accountSettings')}
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
          label={t('common:username')}
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!isUsernameEditable} // Disable unless editable
          onBlur={() => { if (isUsernameEditable) updateUsername(); }} // Auto-save onBlur
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
          label={t('common:email')}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEmailEditable} // Disable unless editable
          onBlur={() => { if (isEmailEditable) updateEmail(); }} // Auto-save onBlur
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

      {/* Current Password Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
      <TextField
          fullWidth
          label={t('settings:currentPassword')}
          variant="outlined"
          type={showCurrentPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={!isPasswordEditable}
          sx={{ width: 'calc(100% - 40px)' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('current')}>
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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

      {/* New Password Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
      <TextField
          fullWidth
          label={t('settings:newPassword')}
          variant="outlined"
          type={showNewPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          disabled={!isPasswordEditable}
          error={!!passwordError}
          helperText={passwordError}
          sx={{ width: 'calc(100% - 40px)' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('new')}>
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Confirm Password Field */}
      <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
      <TextField
          fullWidth
          label={t('common:confirmPassword')}
          variant="outlined"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          disabled={!isPasswordEditable}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{ width: 'calc(100% - 40px)' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

    </Box>
  );
};

export default AccountSettings;
