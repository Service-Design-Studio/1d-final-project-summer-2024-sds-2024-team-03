import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Grid";
import Calendar from "../components/Calendar";
import TodoList from "../components/Actionables/TodoList";
import Chip from "@mui/material/Chip";
import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { useTheme } from "@mui/material/styles";
import DialogAddAction from "../components/Actionables/DialogAddAction";

//IMPORT INTERFACE
import {
  ActionablesPageProps,
  Actionable,
} from "../components/Actionables/Interfaces";

export default function Actionables({
  setFromDate,
  fromDate,
  setToDate,
  toDate,
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: ActionablesPageProps) {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const [data, setData] = useState<Actionable[]>([]);

  const [dataNew, setDataNew] = useState<Actionable[]>([]);
  const [dataInProgress, setDataInProgress] = useState<Actionable[]>([]);
  const [dataDone, setDataDone] = useState<Actionable[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/actionables.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result: Actionable[] = await response.json();
      const newData = result.filter(
        (item: Actionable) => item.status.toLowerCase() === "new".toLowerCase()
      );
      setDataNew(newData);
      const inProgressData = result.filter(
        (item: Actionable) =>
          item.status.toLowerCase() === "in progress".toLowerCase()
      );
      setDataInProgress(inProgressData);
      const doneData = result.filter(
        (item: Actionable) => item.status.toLowerCase() === "done".toLowerCase()
      );
      setDataDone(doneData);

      setData(result);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
      <h1>Actionables</h1>
      <div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "flex-start",
          mb: 7,
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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Chip
              icon={<NewReleasesTwoToneIcon />}
              label="NEW"
              color="secondary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TodoList data={dataNew} />
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
            <TodoList data={dataInProgress} />
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
            <TodoList data={dataDone} />
          </Grid>
        </Grid>
      </Box>

      <DialogAddAction
        fromDate={fromDate}
        toDate={toDate}
        selectedProduct={selectedProduct}
        selectedSource={selectedSource}
        isDetailed={true}
      />
    </Box>
  );
}

export {};
