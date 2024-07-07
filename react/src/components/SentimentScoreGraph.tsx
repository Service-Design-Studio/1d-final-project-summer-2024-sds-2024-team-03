import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Paper, Box, Typography, ButtonBase} from "@mui/material";
import { Dayjs } from "dayjs";
import { ResponsiveLine } from '@nivo/line'
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface SentimentScoreGraphProps {
  fromDate: Dayjs;
  toDate: Dayjs;
  selectedProduct: string[];
  selectedSource: string[];
  isDetailed: boolean;
  setSelectedMenu:React.Dispatch<React.SetStateAction<string>>;
}

export default function SentimentScoreGraph({
fromDate, toDate, selectedProduct, selectedSource, isDetailed, setSelectedMenu
}: SentimentScoreGraphProps) {
  const fromDate_string = fromDate.format('DD/MM/YYYY')
  const toDate_string = toDate.format('DD/MM/YYYY')
  type DataPoint = {
    x: string;
    y: number;
  };
  
  type DataSet = {
    id: string;
    color: string;
    data: DataPoint[];
  };
  
  const [sentimentScores, setSentimentScores] = useState<DataSet[]>([]);
  const [graphProducts, setGraphProducts] = useState<string[]>(selectedProduct);
  const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);

  const theme = useTheme();

  const formatDate = (dateString: string) : string => {
    const [day, month, year] = dateString.split('/').map(Number);
    // months in JavaScript Date are zero-indexed
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
  }

  const handleProductChange = (event: SelectChangeEvent<typeof selectedProduct>) => {
    const {
      target: { value },
    } = event;
    setGraphProducts(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<typeof selectedProduct>) => {
    const {
      target: { value },
    } = event;
    setGraphSubcategories(
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
      const urlPrefix =
        process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
          if (isDetailed) {
      fetch(`${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`)
        .then((response) => response.json())
        .then((data: Record<string, string>[]) => {
          // Not sure if will cause problem as changing useEffect
          if (graphSubcategories.length == 0) {
            const subcategories: string[] = data.map(({subcategory}) => subcategory);
            setGraphSubcategories(subcategories);
          }
          const filteredData = data.filter(item => graphProducts.includes(item.product) && graphSubcategories.includes(item.subcategory));
          const filteredDataGroupedByProduct = filteredData.reduce((acc, item) => {
            if (!acc[item.product]) {
              acc[item.product] = [];
            }
            acc[item.product].push({ date: item.date, sentiment_score: parseFloat(item.sentiment_score as string) });
            return acc;
          }, {} as Record<string, { date: string, sentiment_score: number }[]>);
          
          if (data.length > 0) {
            setSentimentScores(Object.entries(filteredDataGroupedByProduct).map(([product, date_sentiment_score]) => {
            return {
              id: product,
              color: "hsl(8, 70%, 50%)", 
              data: date_sentiment_score.map(({ date, sentiment_score }) => ({
                "x": formatDate(date), 
                "y": sentiment_score
              }))
            };
          }))}
        })} else {
          fetch(`${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`)
        .then((response) => response.json())
        .then((data: Record<string, string>[]) => {
          if (data.length > 0) {
            setSentimentScores([{"id": "all", "color":"hsl(8, 70%, 50%)", "data":data.map(({ date, sentiment_score }) => ({
            "x": formatDate(date),
            "y": parseFloat(sentiment_score)
          }))}]);
          }
        })
    }}, [fromDate, toDate, selectedProduct, selectedSource, graphProducts, graphSubcategories]);
  
    
    {/* Must have parent container with a defined size */}
    return isDetailed ? 
    (
      <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", flexDirection: 'column',}}>
        <Paper sx={{ p: 2, borderRadius: 2, flexDirection: 'row',}} id="overall-sentimentscoregraph">
        <Typography variant="h6" component="h3" sx={{ marginRight: 2, width: "50%" , }}>
          Sentiment vs Time trend for selected Product(s) & Subcategories
        </Typography>

      <FormControl sx={{ m: 0, width: "20%" }}>
        <InputLabel id="detailed-sentimentscoregraph-filter-product-label">Products</InputLabel>
        <Select
          labelId="detailed-sentimentscoregraph-filter-product-label"
          id="detailed-sentimentscoregraph-filter-product"
          multiple
          value={selectedProduct}
          onChange={handleProductChange}
          input={<OutlinedInput id="detailed-sentimentscoregraph-select-product" label="product" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {selectedProduct.map((product: string) => (
            <MenuItem key={product} value={product}>
              {product}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 0, width: "20%" }}>
        <InputLabel id="detailed-sentimentscoregraph-filter-subcategory-label">Subcategories</InputLabel>
        <Select
          labelId="detailed-sentimentscoregraph-filter-subcategory-label"
          id="detailed-sentimentscoregraph-filter-subcategory"
          multiple
          value={graphSubcategories}
          onChange={handleSubcategoryChange}
          input={<OutlinedInput id="detailed-sentimentscoregraph-select-subcategory" label="subcategory" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {graphSubcategories.map((subcategpry: string) => (
            <MenuItem key={subcategpry} value={subcategpry}>
              {subcategpry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", height:200}}>
      {sentimentScores.length > 0 &&  (<ResponsiveLine
        data={ sentimentScores }
          margin={{ top: 20, right: 20, bottom: 40, left: 40  }}
          xScale={{ type: 'point' }}
          yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false
          }}
          yFormat=" >+.1f"
          curve="natural"
          axisTop={null}
          axisRight={null}
          axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: 36,
              legendPosition: 'middle',
              truncateTickAt: 0
          }}
          axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: -40,
              legendPosition: 'middle',
              truncateTickAt: 0
          }}
          enableGridX={false}
          colors={{ scheme: 'category10' }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[
              {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
                              itemOpacity: 1
                          }
                      }
                  ]
              }
          ]}
      />)}
      </Box>
      </Paper>
      </Box>
    )
    :(
      <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", flexDirection: 'column',}}>
        <ButtonBase
      component={Paper}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        borderRadius: 2,
        flex: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f0f0f0", 
        },
      }}
      id="overall-sentimentscoregraph"
      onClick={() => setSelectedMenu("analytics")} >
          <Typography variant="h6" component="h3" sx={{ marginRight: 2, width: "50%"}}>
            Sentiment vs Time trend for Product(s) (All Subcategories)
          </Typography> 
          <Box sx={{ display: 'flex', gap: 2, mt: 2,  width: "100%", height:200}}>
          {sentimentScores.length > 0 && (<ResponsiveLine
            data={ sentimentScores}
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              xScale={{ type: 'point' }}
              yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: true,
                  reverse: false
              }}
              yFormat=" >+.1f"
              curve="natural"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  truncateTickAt: 0
              }}
              axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendOffset: -40,
                  legendPosition: 'middle',
                  truncateTickAt: 0
              }}
              enableGridX={false}
              colors={{ scheme: 'category10' }}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="data.yFormatted"
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
          />)}
          </Box>
        </ButtonBase>
      </Box>
    );
  }
