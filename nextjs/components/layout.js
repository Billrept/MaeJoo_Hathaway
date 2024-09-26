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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          transition: "color 0.85s ease-in-out", // Smooth transition for background and text color
        }}
      >
        <NavigationLayout />
        <main>{children}</main>
        <FooterLayout />
      </Box>
    </ThemeProvider>
  );
}
