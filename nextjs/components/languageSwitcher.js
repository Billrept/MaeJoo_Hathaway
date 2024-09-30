import { useTranslation } from 'react-i18next';
import * as React from "react";
import {
  Button,
  Box,
} from "@mui/material";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);  // Switch language
  };

  return (
    <Box marginRight="40px">
      <Button variant='contained' onClick={() => changeLanguage('en')}>English</Button>
      <Button variant='contained' onClick={() => changeLanguage('th')}>Thai</Button>
    </Box>
  );
};

export default LanguageSwitcher;
