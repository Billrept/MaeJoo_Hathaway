import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import useBearStore from "@/store/useBearStore";


const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const toggleDarkMode = useBearStore((state) => state.toggleDarkMode);
  const isDarkMode = useBearStore((state) => state.isDarkMode);

  return (
    <>
      <AppBar position="sticky" sx={{ paddingRight:'60px', paddingLeft:'60px', backgroundColor: isDarkMode ? "#333" : "#68BB59" }}>
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
          <Typography>{isDarkMode ? 'Dark mode':'Light mode'}</Typography>
          <Switch checked={isDarkMode} onChange={toggleDarkMode} />
          <Button
            variant='contained'
            onClick={() => {
              router.push("/login");
            }}
            style={{backgroundColor:'#2da14c', color:'#ffffff', width:'100px', marginRight:'20px'}}>
            Sign In
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              router.push("/signup");
            }}
            style={{backgroundColor:'#ffffff', color:'#68BB59', width:'100px'}}>
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
          marginLeft:'20px',
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
