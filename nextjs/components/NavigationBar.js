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
  FormControlLabel,
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
import { useAuth } from "@/context/auth";  // Import useAuth hook from AuthProvider
import axios from 'axios';
import LanguageSwitcher from "./languageSwitcher";
import { useTranslation } from 'react-i18next';

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const isDarkMode = useBearStore((state) => state.isDarkMode);
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode);
  const appName = useBearStore((state) => state.appName);
  const { userId, isLoggedIn, logout, setIsLoggedIn } = useAuth();  // Destructure values from the useAuth hook

  const [showSun, setShowSun] = useState(!isDarkMode);
  const [showMoon, setShowMoon] = useState(isDarkMode);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const { t } = useTranslation(['navbar']);

  // Check token validity periodically
  useEffect(() => {
    const token = localStorage.getItem('token');
    const interval = setInterval(() => {
      if (token) {
        axios
          .post('http://localhost:8000/auth/verify-token', { token })
          .then((response) => {
            if (!response.data.valid) {
              logout();
              setIsLoggedIn(false);  // Update isLoggedIn when token is invalid
              router.push('/login');
            }
          })
          .catch(() => {
            logout();
            setIsLoggedIn(false);  // Update isLoggedIn on error
            router.push('/login');
          });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, [logout, router, setIsLoggedIn]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsSwitchDisabled(true); // Disable switch when toggling

    if (isDarkMode) {
      setShowSun(false); // Hide the sun first
      setTimeout(() => setShowMoon(true), 300); // Delay showing the moon
    } else {
      setShowMoon(false); // Hide the moon first
      setTimeout(() => setShowSun(true), 300); // Delay showing the sun
    }

    // Re-enable the switch after the animation completes
    setTimeout(() => {
      setIsSwitchDisabled(false); // Enable switch after 600ms
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
          padding: { xs: "10px", md: "0px" },  // Add padding on small screens only
          backgroundColor: isDarkMode ? "#333" : "#68BB59",
        }}
      >
        <Toolbar>
          {/* Functions Icon */}
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
              fontSize: "22px",
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

          {/* Cash Mode Switch and Dark Mode Switch */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              height: '48px',
              marginRight: '20px',
            }}
          >
            {/* Sun Icon */}
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

            {/* Moon Icon */}
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

            {/* Dark Mode Switch */}
            <Switch
              checked={isDarkMode}
              onChange={handleToggle}
              disabled={isSwitchDisabled} // Disable switch while animation is in progress
            />
          </Box>

          {/* Account Circle and Username */}
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
                User ID: {userId}
              </Typography>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>

              {/* Menu Icon */}
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
                anchorEl={anchorEl} // Anchor for the menu
                open={menuOpen} // Whether the menu is open
                onClose={handleMenuClose} // Close handler
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center", // Align the menu horizontally in the center of the anchor (MenuIcon)
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center", // Transform the menu starting from its center
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => router.push("/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
                <MenuItem onClick={() => { 
                  logout(); 
                  router.push('/login'); 
                  }} >
                  Log out
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
          fontSize: "14px",
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
