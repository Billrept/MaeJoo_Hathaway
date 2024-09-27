import React, { useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import AccountSettings from './settings/accountSettings';
import OtherSettings from './settings/otherSettings';

const SettingsPage = () => {
  const [selectedMenu, setSelectedMenu] = useState('Account');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Account':
        return <AccountSettings />;
      case 'Other':
        return <OtherSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '4vw', paddingX:'10vw' }}>
      <Paper elevation={3} sx={{ display: 'flex', width: '100%', padding: 3 }}>
        {/* Left Sidebar */}
        <Box sx={{ width: '20%', padding: 2, borderRight: '1px solid #e0e0e0' }}>
          <List component="nav">
            <ListItem button onClick={() => setSelectedMenu('Account')}>
              <ListItemText primary="Account" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setSelectedMenu('Other')}>
              <ListItemText primary="Other" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ width: '80%', padding: 3 }}>
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
