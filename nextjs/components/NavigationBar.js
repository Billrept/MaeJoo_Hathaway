import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import useBearStore from "@/store/useBearStore";
import { useState, useEffect } from "react";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const isDarkMode = useBearStore((state) => state.isDarkMode); // Global dark mode state
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode); // Function to toggle dark mode

  // States to handle icon transitions
  const [showSun, setShowSun] = useState(!isDarkMode);
  const [showMoon, setShowMoon] = useState(isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      // Moon should rise, and sun should set
      setShowSun(false);
      setTimeout(() => setShowMoon(true), 500); // Moon rises after sun sets
    } else {
      // Sun should rise, and moon should set
      setShowMoon(false);
      setTimeout(() => setShowSun(true), 500); // Sun rises after moon sets
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    toggleDarkMode(); // Toggle between dark and light mode
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          paddingRight: "60px",
          paddingLeft: "60px",
          backgroundColor: isDarkMode ? "#333" : "#68BB59",
        }}
      >
        <Toolbar>
          <Link href={"/"}>
            <FunctionsIcon sx={{ color: "#ffffff" }} fontSize="large" />
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Sun and Moon Icons next to Switch with Animation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              height: "48px",
              marginRight: "20px",
            }}
          >
            {/* Sun icon */}
            <IconButton
              disableRipple
              sx={{
                position: "absolute",
                right: "10px", // Position next to the switch
                opacity: showSun ? 1 : 0, // Show or hide based on state
                transform: showSun ? "translateY(0)" : "translateY(20px)", // Sun rises/sets
                transition: "opacity 0.55s, transform 0.7s ease", // Smooth transition
                marginRight: "40px",
              }}
            >
              <WbSunnyIcon fontSize="large" sx={{ color: "#FFD700" }} />
            </IconButton>

            {/* Moon icon */}
            <IconButton
              disableRipple
              sx={{
                position: "absolute",
                right: "10px", // Position next to the switch
                opacity: showMoon ? 1 : 0, // Show or hide based on state
                transform: showMoon ? "translateY(0)" : "translateY(20px)", // Moon rises/sets
                transition: "opacity 0.55s, transform 0.7s ease", // Smooth transition
                marginRight: "40px",
              }}
            >
              <Brightness2Icon fontSize="large" sx={{ color: "#ffffff" }} />
            </IconButton>

            <Switch checked={isDarkMode} onChange={handleToggle} />
          </Box>

          {/* Sign In and Sign Up buttons */}
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
      <Button
        sx={{
          marginLeft: '20px',
          fontSize: "17px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px",
          textDecoration: "none",
        }}
      >
        {label}
      </Button>
    </Link>
  );
};

export default NavigationLayout;
