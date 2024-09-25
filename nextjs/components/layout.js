import NavigationLayout from "./NavigationBar";
import FooterLayout from "./footer";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import useBearStore from "@/store/useBearStore";

export default function Layout({ children }) {
  const isDarkMode = useBearStore((state) => state.isDarkMode);

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
      {/* Apply transition to background and color for a smooth fade effect */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "background-color 0.5s ease, color 0.5s ease", // Smooth transition for background and text colors
        }}
      >
        <NavigationLayout />
        <main>{children}</main>
        <FooterLayout />
      </Box>
    </ThemeProvider>
  );
}
