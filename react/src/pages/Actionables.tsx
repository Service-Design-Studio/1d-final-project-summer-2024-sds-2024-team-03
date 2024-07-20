import * as React from "react";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Grid";
import Calendar from "../components/Calendar";
import Todo from "../components/Actionables/TodoList";
import Chip from "@mui/material/Chip";
import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { SxProps } from "@mui/system";
import { useTheme } from "@mui/material/styles";

interface ActionablesProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

const fabStyle = {
  position: "absolute",
  bottom: 64,
  right: 64,
};

const fab = {
  color: "primary" as "primary",
  sx: fabStyle as SxProps,
  icon: <AddIcon />,
  label: "Add",
};

export default function Actionables({
  setFromDate,
  fromDate,
  setToDate,
  toDate,
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: ActionablesProps) {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
      <h1>Actionables</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ flexBasis: { xs: "100%", sm: "40%" }, flexGrow: 1 }}>
          <Calendar
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </Box>
        <Box sx={{ flexBasis: { xs: "100%", sm: "30%" }, flexGrow: 1 }}>
          <FilterProduct
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            multiple={true}
          />
        </Box>
        <Box sx={{ flexBasis: { xs: "100%", sm: "30%" }, flexGrow: 1 }}>
          <FilterSource
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            multiple={true}
          />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Chip
              icon={<NewReleasesTwoToneIcon />}
              label="NEW"
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Todo />
          </Grid>
          <Grid item xs={4}>
            <Chip
              icon={<RotateRightTwoToneIcon />}
              label="IN PROGRESS"
              variant="outlined"
              sx={{
                mb: 2,
                color: "#DA5707",
                borderColor: "#DA5707",
                "& .MuiChip-icon": {
                  color: "#DA5707",
                },
              }}
            />
            <Todo />
          </Grid>
          <Grid item xs={4}>
            <Chip
              icon={<CheckCircleTwoToneIcon />}
              label="DONE"
              variant="outlined"
              sx={{
                mb: 2,
                color: "#208306",
                borderColor: "#208306",
                "& .MuiChip-icon": {
                  color: "#208306",
                },
              }}
            />
            <Todo />
          </Grid>
        </Grid>
      </Box>
      <Zoom
        key={fab.color}
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        unmountOnExit
      >
        <Fab sx={fab.sx} aria-label={fab.label} color={fab.color}>
          {fab.icon}
        </Fab>
      </Zoom>
    </Box>
  );
}

export {};
