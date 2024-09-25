import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  IconButton,
  Slide,
  Box
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import useBearStore from "@/store/useBearStore";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark mode icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light mode icon
import { useTheme } from "@mui/material/styles"; // Import theme to use mixins

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode);
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  // Accessing the Material UI theme to use the mixins.toolbar height
  const theme = useTheme();

  return (
    <>
      <AppBar position="sticky" sx={{ paddingRight: '60px', paddingLeft: '60px', backgroundColor: isDarkMode ? "#333" : "#68BB59" }}>
        <Toolbar>
          <Link href={"/"}>
            <FunctionsIcon sx={{ color: "#ffffff" }} fontSize="large" />
          </Link>
          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Prompt",
            }}>
            MJ Hathaway
          </Typography>
          <NavigationLink href="/dashboard" label="Dashboard" />
          <NavigationLink href="/market" label="Market" />
          <div style={{ flexGrow: 1 }} />
          
          <Box display="flex" alignItems="center" sx={{ overflow: 'hidden', minHeight: theme.mixins.toolbar.minHeight, position: 'relative' }}>
            <Box sx={{ position: 'relative', width: '48px', height: '48px' }}>
              <Slide
                direction="up"
                in={isDarkMode}
                timeout={{
                  enter: 1000,
                  exit: 1000
                }}
                easing={{
                  enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  exit: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <IconButton color="inherit" sx={{ position: 'absolute', top: 0, left: 0 }}>
                  <Brightness4Icon />
                </IconButton>
              </Slide>
              
              <Slide
                direction="up"
                in={!isDarkMode}
                timeout={{
                  enter: 1000,
                  exit: 1000
                }}
                easing={{
                  enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  exit: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <IconButton color="inherit" sx={{ position: 'absolute', top: 0, left: 0 }}>
                  <Brightness7Icon />
                </IconButton>
              </Slide>
            </Box>

            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              color="default"
              inputProps={{ 'aria-label': 'dark mode switch' }}
            />
          </Box>



          <Button
            variant='contained'
            onClick={() => {
              router.push("/login");
            }}
            style={{ backgroundColor: '#2da14c', color: '#ffffff', width: '100px', marginRight: '20px' }}>
            Sign In
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              router.push("/signup");
            }}
            style={{ backgroundColor: '#ffffff', color: '#68BB59', width: '100px' }}>
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
      <Typography
        variant="body1"
        sx={{
          marginLeft: '20px',
          fontSize: "17px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px",
          textDecoration: 'none',
          color: 'white',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: isDarkMode ? '#68BB59' : '#0cab37',
          }
        }}>
        {label}
      </Typography>{" "}
    </Link>
  );
};

export default NavigationLayout;
