import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  Switch
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";
import { useState } from "react";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  const [ isDarkMode, setIsDarkMode ] = useState(false);

  const handleSwitchChange = (event) => {
    setIsDarkMode(event.target.checked)
  };

  return (
    <>
      <AppBar position="sticky" sx={{ paddingRight:'60px', paddingLeft:'60px', backgroundColor: "#68BB59" }}>
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
          <div style={{ flexGrow: 1 }} />
          <Typography> Dark mode: {String(isDarkMode)}</Typography>
          <Switch checked={isDarkMode} onChange={handleSwitchChange}>
          </Switch>
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
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          // textTransform: "uppercase",
          color: "#fff",
          padding: "0 10px", // Add padding on left and right
        }}>
        {label}
      </Typography>{" "}
    </Link>
  );
};

export default NavigationLayout;
