import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface DashboardProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
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
      <h1>Analytics</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                label="From"
                value={dayjs(fromDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  console.log(newValue)
                  setFromDate(
                    newValue ? newValue : dayjs().subtract(1, 'week')
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                label="To"
                value={dayjs(toDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  setToDate(
                    newValue ? newValue: dayjs()
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
