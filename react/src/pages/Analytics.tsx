import * as React from "react";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Grid from "@mui/material/Unstable_Grid2";
import Calendar from "../components/Calendar";
import SentimentScoreGraph from "../components/SentimentScoreGraph";

interface AnalyticsProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Analytics({
  setFromDate,
  fromDate,
  setToDate,
  toDate,
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: AnalyticsProps) {
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
      <h1>Analytics</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "flex-start",
          mb: 7
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
      <SentimentScoreGraph
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
