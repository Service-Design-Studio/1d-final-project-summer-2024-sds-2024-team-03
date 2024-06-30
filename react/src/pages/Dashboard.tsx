import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import OverallSentimentScore from "../components/dashboard/OverallSentimentScore";
import SentimentDistribution from "../components/dashboard/SentimentDistribution";
import SentimentScoreGraph from "../components/SentimentScoreGraph";
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
      <h1>Overview Dashboard</h1>
      <Box sx={{ flexGrow: 1 }}>

        <Grid container spacing={2}>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              slotProps={{
                textField: {
                  required: true,
                  id: 'from-date',
                },
              }}
                format="DD/MM/YYYY"
                label="From"
                value={dayjs(fromDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
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
              slotProps={{
                textField: {
                  required: true,
                  id: 'to-date',
                },
              }}
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

      {/* If dates, products, sources not selected yet, all these should not show / be disabled */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 , alignItems: 'center', flexDirection: 'row' }}>
        <OverallSentimentScore
          fromDate = {fromDate}
          toDate = {toDate}
          selectedProduct = {selectedProduct}
          selectedSource = {selectedSource}
        />

        <SentimentDistribution
          fromDate = {fromDate}
          toDate = {toDate}
          selectedProduct = {selectedProduct}
          selectedSource = {selectedSource}
        />

        <Paper sx={{ p: 2, borderRadius: 2, flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 200 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>To Promote</Typography>
              <Typography variant="body2"color="grey">maintain user-friendly staff</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>To Amplify</Typography>
              <Typography variant="body2"color="grey">Price</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1"sx={{ fontWeight: 'bold' }} >Keep in Mind</Typography>
              <Typography variant="body2"color="grey">More efficient card replacement</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>To Fix</Typography>
              <Typography variant="body2"color="grey">Paylah! break downs</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <SentimentScoreGraph
      fromDate = {fromDate}
      toDate = {toDate}
      selectedProduct = {selectedProduct}
      selectedSource = {selectedSource}
      isDetailed = {false}
      />
      
      
      </>
  );
}

export {};
