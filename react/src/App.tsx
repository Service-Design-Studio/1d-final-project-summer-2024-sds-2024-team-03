import React, {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import dayjs from "dayjs";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Actionables from "./pages/Actionables";
import UploadData from "./pages/UploadData";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import dbsLogo from "./dbs_logo.png";

// Define your themes with explicit primary color
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: "#FD0606", // Red color for dark theme
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light', // Enable light mode
    primary: {
      main: "#8D1927", // Red color for light theme
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

export default function MainApp() {
  // State for managing dark theme
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiAppBar position="fixed">
          <Toolbar>
            <AppBarContent>
              <img src={dbsLogo} alt="DBS Logo" style={{ height: 30 }} />
              <Box sx={{ display: "flex", gap: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.key}
                    color="inherit"
                    onClick={() => setSelectedMenu(item.key)}
                    sx={{
                      backgroundColor: selectedMenu === item.key ? "rgba(255, 255, 255, 0.1)" : "transparent",
                      '&:hover': {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                {/* Dark/light mode toggle button */}
                <Button color="inherit" onClick={toggleDarkMode}>
                  {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
                </Button>
              </Box>
            </AppBarContent>
          </Toolbar>
        </MuiAppBar>
        <Main theme={darkMode ? darkTheme : lightTheme}>
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
          {selectedMenu === "upload data" && (
            <UploadData
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          )}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
