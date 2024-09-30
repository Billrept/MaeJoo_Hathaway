import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, IconButton, Menu, MenuItem, ListItemText } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"; // Language icon from MUI

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose(); // Close dropdown after language change
  };

  return (
    <Box marginRight="40px">
      {/* Language Icon Button */}
      <IconButton
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <LanguageIcon />
      </IconButton>

      {/* Dropdown Menu positioned in the bottom middle */}
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
      >
        {/* English Option */}
        <MenuItem onClick={() => changeLanguage('en')}>
          <ListItemText primary="English (อังกฤษ)" />
        </MenuItem>

        {/* Thai Option */}
        <MenuItem onClick={() => changeLanguage('th')}>
          <ListItemText primary="Thai (ไทย)" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
