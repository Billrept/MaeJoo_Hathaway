import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  Button,
  Box,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import useBearStore from "@/store/useBearStore";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import axios from 'axios';
import LanguageSwitcher from "./languageSwitcher";
import { useTranslation } from 'react-i18next';

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const isDarkMode = useBearStore((state) => state.isDarkMode);
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode);
  const appName = useBearStore((state) => state.appName);
  const { isLoggedIn, logout, setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState('');

  const [showSun, setShowSun] = useState(!isDarkMode);
  const [showMoon, setShowMoon] = useState(isDarkMode);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const { t } = useTranslation(['navbar']);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const interval = setInterval(() => {
      if (token) {
        axios
          .post('http://localhost:8000/auth/verify-token', { token })
          .then((response) => {
            if (!response.data.valid) {
              logout();
              setIsLoggedIn(false);
              router.push('/login');
            }
          })
          .catch(() => {
            logout();
            setIsLoggedIn(false);
            router.push('/login');
          });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout, router, setIsLoggedIn]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsSwitchDisabled(true);

    if (isDarkMode) {
      setShowSun(false);
      setTimeout(() => setShowMoon(true), 300);
    } else {
      setShowMoon(false);
      setTimeout(() => setShowSun(true), 300);
    }

    setTimeout(() => {
      setIsSwitchDisabled(false);
    }, 600);
  }, [isDarkMode]);

  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          padding: { xs: "10px", md: "0px" },
          backgroundColor: isDarkMode ? "#333" : "#68BB59",
        }}
      >
        <Toolbar>
          <Link href={"/"}>
            <FunctionsIcon
              sx={{
                color: "#ffffff",
                textDecoration: "none",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: isDarkMode ? "#68BB59" : "#0cab37",
                },
              }}
              fontSize="large"
            />
          </Link>

          <Typography
            variant="body1"
            sx={{
              fontSize: "26px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Sofia",
            }}
          >
            {appName}
          </Typography>

          <NavigationLink href="/dashboard" label={t('dashboard')} />
          <NavigationLink href="/market" label={t('market')} />

          <Box sx={{ flexGrow: 1 }} />

          <LanguageSwitcher></LanguageSwitcher>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              height: '48px',
              marginRight: '20px',
            }}
          >
            <IconButton
              disableRipple
              sx={{
                position: 'absolute',
                right: '10px',
                opacity: showSun ? 1 : 0,
                visibility: showSun ? 'visible' : 'hidden',
                transform: showSun ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s, transform 0.3s ease, visibility 0.3s',
                marginRight: '40px',
              }}
            >
              <WbSunnyIcon fontSize="small" sx={{ color: '#FFD700' }} />
            </IconButton>

            <IconButton
              disableRipple
              sx={{
                position: 'absolute',
                right: '10px',
                opacity: showMoon ? 1 : 0,
                visibility: showMoon ? 'visible' : 'hidden',
                transform: showMoon ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s, transform 0.3s ease, visibility 0.3s',
                marginRight: '40px',
              }}
            >
              <Brightness2Icon fontSize="small" sx={{ color: '#ffffff' }} />
            </IconButton>

            <Switch
              checked={isDarkMode}
              onChange={handleToggle}
              disabled={isSwitchDisabled}
            />
          </Box>

          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#ffffff",
                  marginRight: "10px",
                }}
              >
                Username: {username}
              </Typography>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>

              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{ marginLeft: 1 }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => router.push("/dashboard")}>{t('dashboard')}</MenuItem>
                <MenuItem onClick={() => router.push("/settings")}>{t('settings')}</MenuItem>
                <MenuItem onClick={() => { 
                  logout(); 
                  router.push('/login'); 
                  }} >
                  {t('logout')}
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/login");
                }}
                sx={{
                  backgroundColor: "#2da14c",
                  color: "#ffffff",
                  width: "150px",
                  marginRight: "20px",
                }}
              >
                {t('signIn')}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/signup");
                }}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#68BB59",
                  width: "150px",
                }}
              >
                {t('signUp')}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => {
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px",
          textDecoration: "none",
          color: "white",
          transition: "color 0.3s ease",
          "&:hover": {
            color: isDarkMode ? "#68BB59" : "#0cab37",
          },
        }}
      >
        {label}
      </Typography>
    </Link>
  );
};

export default NavigationLayout;
