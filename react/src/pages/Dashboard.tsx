import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OverallSentimentScore from "../components/Dashboard/OverallSentimentScore";
import SentimentDistribution from "../components/Dashboard/SentimentDistribution";
import SentimentScoreGraph from "../components/SentimentScoreGraph";
import CategoriesSunburstChart from "../components/Dashboard/CategoriesSunburstChart";
import SentimentCategoriesGraph from "../components/SentimentCategoriesGraph";

interface DashboardProps {
    setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    fromDate: Dayjs;
    setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    toDate: Dayjs;
    selectedProduct: string[];
    setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSource: string[];
    setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
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
  setSelectedMenu,
}: DashboardProps) 

{ return (
  <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
    <h1>Overview Dashboard</h1>

    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2,
      justifyContent: 'flex-start'
    }}>
      <Box sx={{ flexBasis: { xs: '100%', sm: '25%' }, flexGrow: 1 }}>
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
      </Box>
      <Box sx={{ flexBasis: { xs: '100%', sm: '25%' }, flexGrow: 1 }}>
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
      </Box>
      <Box sx={{ flexBasis: { xs: '100%', sm: '25%' }, flexGrow: 1 }}>
        <FilterProduct
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          multiple={true}
        />
      </Box>
      <Box sx={{ flexBasis: { xs: '100%', sm: '25%' }, flexGrow: 1 }}>
        <FilterSource
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          multiple={true}
        />
      </Box>
    </Box>
  
    {/* If dates, products, sources not selected yet, all these should not show / be disabled */}
    <Box sx={{ py: 5, display: 'flex', gap: 2, mt: 2, alignItems: 'stretch', flexDirection: 'row'}}>
      <OverallSentimentScore
        fromDate = {fromDate}
        toDate = {toDate}
        selectedProduct = {selectedProduct}
        selectedSource = {selectedSource}
        setSelectedMenu = {setSelectedMenu}
      />

      <SentimentDistribution
        fromDate = {fromDate}
        toDate = {toDate}
        selectedProduct = {selectedProduct}
        selectedSource = {selectedSource}
        setSelectedMenu = {setSelectedMenu}
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
        {/* setSelectedMenu = {setSelectedMenu} */}
    </Box>

    <SentimentScoreGraph
        fromDate={fromDate}
        toDate={toDate}
        selectedProduct={selectedProduct}
        selectedSource={selectedSource}
        isDetailed={false}
        setSelectedMenu={setSelectedMenu}
    />

    <CategoriesSunburstChart
        fromDate={fromDate}
        toDate={toDate}
        selectedProduct={selectedProduct}
        selectedSource={selectedSource}
        setSelectedMenu={setSelectedMenu}
    />

    <SentimentCategoriesGraph
        fromDate={fromDate}
        toDate={toDate}
        selectedProduct={selectedProduct}
        selectedSource={selectedSource}
        isDetailed={false}
        setSelectedMenu={setSelectedMenu}
    />
  </Box>
);
}
