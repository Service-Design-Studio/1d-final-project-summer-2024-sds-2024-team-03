import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import dayjs from "dayjs";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// for dropdown menu on smaller screens:
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import dbsLogo from "./dbs_logo.png";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Actionables from "./pages/Actionables";
import UploadData from "./pages/UploadData";

// Define your themes with explicit primary color
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enable dark mode
    primary: {
      main: "#FD0606", // Red color for dark theme
    },
    background: {
      default: "#000", // Explicitly set the background color to black
    },
    secondary: {
      main: "#C00", // Red color for light theme
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light", // Enable light mode
    primary: {
      main: "#000", // Black color for light theme
    },
    background: {
      default: "#E9E9EB", // Explicitly set the background color to light grey
    },
    secondary: {
      main: "#E00", // Red color for light theme
    },
  },
});

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64, // Adjust this value based on your AppBar height
}));

const AppBarContent = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px", // Adjust based on your preferred maximum width
  margin: "0 auto",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const Footer = styled("footer")(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#000000",
  color: "#ffffff", // White text
  textAlign: "center",
  padding: theme.spacing(0.2),
  width: "100%",
  marginTop: 48,
}));

const FooterText = styled("div")({
  marginTop: 2,
  marginBottom: 2, // Add margin above the text
  fontSize: "1.1rem",
});

const StyledDrawer = styled(Drawer)(({ theme }: { theme: Theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: "#000000", // Black background for the drawer
    color: "#ffffff", // White text
  },
}));

export default function MainApp() {
  // State for managing dark theme
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getInitialState = () => {
    const savedState = localStorage.getItem("selectedMenu");
    return savedState ? savedState : "dashboard";
  };

  const [selectedMenu, setSelectedMenu] = useState(getInitialState);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "week"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  const menuItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Analytics", key: "analytics" },
    { name: "Actionables", key: "actionables" },
    { name: "Upload Data", key: "upload data" },
  ];

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = darkMode ? darkTheme : lightTheme;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <MuiAppBar position="fixed" sx={{ height: 64 }}>
          <Toolbar
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AppBarContent>
              <img src={dbsLogo} alt="DBS Logo" style={{ height: 30 }} />
              {isSmallScreen ? (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  sx={{ ml: 2 }}
                >
                  {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              ) : (
                <Box sx={{ display: "flex", gap: 2 }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.key}
                      color="inherit"
                      onClick={() => setSelectedMenu(item.key)}
                      sx={{
                        borderRadius: 4,
                        padding: "0rem 1rem",
                        backgroundColor:
                          selectedMenu === item.key
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                  <Button
                    color="inherit"
                    onClick={toggleDarkMode}
                    sx={{ borderRadius: 4 }}
                  >
                    {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
                  </Button>
                </Box>
              )}
            </AppBarContent>
          </Toolbar>
        </MuiAppBar>

        <StyledDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ width: 250, m: 6 }}>
            {menuItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelectedMenu(item.key);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={toggleDarkMode}>
                <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
              </ListItemButton>
            </ListItem>
          </List>
        </StyledDrawer>

        <Main theme={theme}>
          {selectedMenu === "dashboard" && (
            <Dashboard
              setFromDate={setFromDate}
              fromDate={fromDate}
              setToDate={setToDate}
              toDate={toDate}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              setSelectedMenu={setSelectedMenu}
            />
          )}
          {selectedMenu === "analytics" && (
            <Analytics
              setFromDate={setFromDate}
              fromDate={fromDate}
              setToDate={setToDate}
              toDate={toDate}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          )}
          {selectedMenu === "actionables" && (
            <Actionables
              setFromDate={setFromDate}
              fromDate={fromDate}
              setToDate={setToDate}
              toDate={toDate}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          )}
          {selectedMenu === "upload data" && <UploadData />}
        </Main>
        <Footer>
          <FooterText>© DBS 2024</FooterText>
        </Footer>
      </Box>
    </ThemeProvider>
  );
}
