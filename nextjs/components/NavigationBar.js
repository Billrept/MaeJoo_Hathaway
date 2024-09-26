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
  FormControlLabel
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

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const isDarkMode = useBearStore((state) => state.isDarkMode);
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode);
  const appName = useBearStore((state) => state.appName);

  const [showSun, setShowSun] = useState(!isDarkMode);
  const [showMoon, setShowMoon] = useState(isDarkMode);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("John Doe"); // Placeholder username
  const [isCashMode, setIsCashMode] = useState(false); // Toggle cash mode

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  // Handle cash splash
  const handleClick = (e) => {
    if (!isCashMode) return;

    const cashCount = 10;
    for (let i = 0; i < cashCount; i++) {
      const cashSplash = document.createElement("div");
      cashSplash.classList.add("cash-splash");
      cashSplash.style.left = `${e.clientX}px`;
      cashSplash.style.top = `${e.clientY}px`;
      cashSplash.style.setProperty("--x", Math.random() * 2 - 1);
      cashSplash.style.setProperty("--y", Math.random() * 2 - 1);
      document.body.appendChild(cashSplash);

      setTimeout(() => {
        cashSplash.remove();
      }, 700);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      setShowSun(false);
      setTimeout(() => setShowMoon(true), 400);
    } else {
      setShowMoon(false);
      setTimeout(() => setShowSun(true), 400);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isCashMode) {
      document.body.style.cursor = "url('/cashCursor.png'), auto";
      document.addEventListener("click", handleClick);
    } else {
      document.body.style.cursor = "auto";
      document.removeEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isCashMode]);

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

          <NavigationLink href="/dashboard" label="Dashboard" />
          <NavigationLink href="/market" label="Market" />

          <Box sx={{ flexGrow: 1 }} />

          {/* Cash Mode Switch and Dark Mode Switch */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              height: "48px",
              marginRight: "20px",
            }}
          >
            {/* Cash Mode Switch */}
            <FormControlLabel
              sx={{ marginRight: '80px' }}
              control={
                <Switch
                  checked={isCashMode}
                  onChange={() => setIsCashMode(!isCashMode)}
                  color="primary"
                  sx={{ marginRight: "10px" }}
                />
              }
              label="Cash Mode"
            />

            {/* Sun Icon */}
            <IconButton
              disableRipple
              sx={{
                position: "absolute",
                right: "10px",
                opacity: showSun ? 1 : 0,
                visibility: showSun ? "visible" : "hidden", // Hide sun completely when invisible
                transform: showSun ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.55s, transform 0.55s ease, visibility 0.55s",
                marginRight: "40px",
              }}
            >
              <WbSunnyIcon fontSize="small" sx={{ color: "#FFD700" }} />
            </IconButton>

            {/* Moon Icon */}
            <IconButton
              disableRipple
              sx={{
                position: "absolute",
                right: "10px",
                opacity: showMoon ? 1 : 0,
                visibility: showMoon ? "visible" : "hidden", // Hide moon completely when invisible
                transform: showMoon ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.55s, transform 0.55s ease, visibility 0.55s",
                marginRight: "40px",
              }}
            >
              <Brightness2Icon fontSize="small" sx={{ color: "#ffffff" }} />
            </IconButton>

            {/* Dark Mode Switch */}
            <Switch checked={isDarkMode} onChange={handleToggle} />
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
                {username}
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
                <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => router.push("/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    setIsLoggedIn(false); 
                    router.push('/login');
                  }}
                >
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
                  width: "100px",
                  marginRight: "20px",
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/signup");
                }}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#68BB59",
                  width: "100px",
                }}
              >
                Sign Up
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