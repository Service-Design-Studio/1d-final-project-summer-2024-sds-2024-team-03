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

interface DashboardProps {
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
  fromDate: string;
  setToDate: React.Dispatch<React.SetStateAction<string>>;
  toDate: string;
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Dashboard({
  setFromDate,
  fromDate,
  setToDate,
  toDate,
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: DashboardProps) {
  return (
    <>
      <h1>Actionable</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From"
                value={dayjs(fromDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  setFromDate(
                    newValue ? newValue.format("MM/DD/YYYY") : "01/01/2020"
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To"
                value={dayjs(toDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  setToDate(
                    newValue ? newValue.format("MM/DD/YYYY") : "01/01/2024"
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={3}>
            <FilterProduct
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </Grid>
          <Grid xs={3}>
            <FilterSource
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export {};