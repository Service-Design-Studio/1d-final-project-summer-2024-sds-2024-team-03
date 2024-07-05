import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Calendar from "../components/Calendar";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import OverallSentimentScore from "../components/dashboard/OverallSentimentScore";
import SentimentDistribution from "../components/dashboard/SentimentDistribution";
import SentimentScoreGraph from "../components/SentimentScoreGraph";
import { ResponsiveBar } from '@nivo/bar'

interface DashboardProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedMenu:React.Dispatch<React.SetStateAction<string>>;
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
}: DashboardProps) {
  

  return (
    <>
      <h1>Overview Dashboard</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          
        <Calendar
          fromDate = {fromDate}
          setFromDate = {setFromDate}
          toDate = {toDate}
          setToDate = {setToDate}
          isFrom = {true}
        />

        <Calendar
          fromDate = {fromDate}
          setFromDate = {setFromDate}
          toDate = {toDate}
          setToDate = {setToDate}
          isFrom = {false}
        />
          

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
      fromDate = {fromDate}
      toDate = {toDate}
      selectedProduct = {selectedProduct}
      selectedSource = {selectedSource}
      isDetailed = {false}
      setSelectedMenu = {setSelectedMenu}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", flexDirection: 'column',}} id="detailed-sentimentscoregraph">
        <Paper sx={{ p: 2, borderRadius: 2, flexDirection: 'row',}}>
        <Typography variant="h6" component="h3" sx={{ marginRight: 2, width: "50%" , }}>
          Top 5 Positive Subcategories
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", height:200}}>
        <ResponsiveBar
          data={[
          {
            "subcategory": "Card>Perks",
            "very angry": -29,
            "very angryColor": "hsl(181, 70%, 50%)",
            "sad": -11,
            "sadColor": "hsl(130, 70%, 50%)",
            "others": 24,
            "othersColor": "hsl(222, 70%, 50%)",
            "satisfied": 28,
            "satisfiedColor": "hsl(125, 70%, 50%)",
            "happy": 8,
            "happyColor": "hsl(289, 70%, 50%)",
          },
          {
            "subcategory": "Loan>Interest",
            "very angry": -9,
            "very angryColor": "hsl(181, 70%, 50%)",
            "sad": -21,
            "sadColor": "hsl(130, 70%, 50%)",
            "others": 5,
            "othersColor": "hsl(222, 70%, 50%)",
            "satisfied": 12,
            "satisfiedColor": "hsl(125, 70%, 50%)",
            "happy": 53,
            "happyColor": "hsl(289, 70%, 50%)",
          }]}
        keys={[
            'very angry',
            'sad',
            'others',
            'satisfied',
            'happy',
        ]}
        indexBy="subcategory"
        margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
        padding={0.3}
        minValue={-100}
        maxValue={100}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'red_yellow_blue' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'very angry'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'others'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Percent',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        enableGridX={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[]}
        role="application"
        ariaLabel="Categorization"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" for Subcategory: "+e.indexValue}
    />
    {/* setSelectedMenu = {setSelectedMenu} */}
    </Box>
    </Paper>
    </Box>
      </>
  );
}

export {};
