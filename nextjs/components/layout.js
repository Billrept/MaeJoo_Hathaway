import NavigationLayout from "./NavigationBar";
import FooterLayout from "./footer";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import useBearStore from "@/store/useBearStore";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const isDarkMode = useBearStore((state) => state.isDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures the transition effect happens after the component mounts
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#262626",
        paper: "#1E1E1E",
      },
      text: {
        primary: "#ffffff",
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#f4f4f4",
        paper: "#ffffff",
      },
      text: {
        primary: "#000000",
      },
    },
  });

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensure it takes the full viewport height
          bgcolor: "background.default",
          transition: mounted
            ? "background-color 0.95s ease-in-out, color 0.85s ease-in-out, transform 0.85s ease-in-out"
            : "none",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <NavigationLayout />
        {/* Main content with flex-grow to fill available space */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // This will make the content stretch and push the footer to the bottom
          }}
        >
          {children}
        </Box>
        <FooterLayout />
      </Box>
    </ThemeProvider>
  );
}
