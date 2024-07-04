import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import dayjs, { Dayjs } from "dayjs";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Actionables from "./pages/Actionables";
import { useState } from "react";

const drawerWidth = 240;
// Create a new theme using `createTheme`
const theme = createTheme({
  palette: {
    primary: {
      main: "#8D1927", // replace '#yourColor' with your desired color
    },
  },
});

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MainApp() {
  const [open, setOpen] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'week'));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedProduct, setSelectedProduct] = React.useState<string[]>([]);
  const [selectedSource, setSelectedSource] = React.useState<string[]>([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              id="nav-hamburger"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              VOCUS x JBAAAM
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {Object.entries({"Dashboard": DashboardIcon, "Analytics": BarChartIcon, "Actionables": ListAltIcon, "Upload Data":CloudUploadIcon }).map(
              ([page, Icon]) => (
                <ListItem key={page} disablePadding >
                  <ListItemButton 
                    onClick={() => setSelectedMenu(page.toLowerCase())}
                    className={selectedMenu === page.toLowerCase() ? "menu-item-active" : "menu-item"}
                    sx={{
                      backgroundColor: selectedMenu === page.toLowerCase() ? "grey": "inherit",
                    }}
                  >
                    <ListItemIcon>
                    <Icon />
                    </ListItemIcon>
                    <ListItemText primary={page} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Drawer>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="lg">
            <Main open={open} >
              <DrawerHeader />
              {selectedMenu === "dashboard" && (
                <>
                  <Dashboard
                    setFromDate={setFromDate}
                    fromDate={fromDate}
                    setToDate={setToDate}
                    toDate={toDate}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    selectedSource={selectedSource}
                    setSelectedSource={setSelectedSource}
                  />
                </>
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
            </Main>
          </Container>
        </React.Fragment>
      </Box>
    </ThemeProvider>
  );
}

export {};
