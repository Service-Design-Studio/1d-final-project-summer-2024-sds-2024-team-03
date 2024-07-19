import * as React from "react";
import Box from "@mui/material/Box";
import dayjs, {Dayjs} from "dayjs";
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
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
            <h1>Analytics</h1>
            <Box sx={{flexGrow: 1, flexDirection: "row"}}>
                <Grid container>
                    <Calendar
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                    <FilterProduct
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                    />
                    <FilterSource
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                    />
                </Grid>
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
