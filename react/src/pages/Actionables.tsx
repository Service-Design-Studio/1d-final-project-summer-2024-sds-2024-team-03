import * as React from "react";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Calendar from "../components/Calendar";
import Todo from "../components/Todo";

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
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{ color: "red", fontWeight: "bold" }}
            >
              NEW
            </Typography>
            <Todo />
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{ color: "orange", fontWeight: "bold" }}
            >
              IN PROGRESS
            </Typography>
            <Todo />
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{ color: "green", fontWeight: "bold" }}
            >
              DONE
            </Typography>
            <Todo />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export {};
