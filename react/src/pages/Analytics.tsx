import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function Dashboard() {
  return (
    <>
      <h1>Feedback Analytics</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="From" sx={{ width: "100%" }} />
            </LocalizationProvider>
          </Grid>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="To" sx={{ width: "100%" }} />
            </LocalizationProvider>
          </Grid>
          <Grid xs={3}>
            <FilterProduct />
          </Grid>
          <Grid xs={3}>
            <FilterSource />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export {};
