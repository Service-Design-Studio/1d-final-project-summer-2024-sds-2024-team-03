import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Paper, Typography, ButtonBase } from "@mui/material";
import { Dayjs } from "dayjs";

interface SentimentDistributionProps {
  fromDate: Dayjs;
  toDate: Dayjs;
  selectedProduct: string[];
  selectedSource: string[];
  setSelectedMenu:React.Dispatch<React.SetStateAction<string>>;
}

export default function SentimentDistribution({
fromDate, toDate, selectedProduct, selectedSource, setSelectedMenu
}: SentimentDistributionProps) {
  const fromDate_string = fromDate.format('DD/MM/YYYY')
  const toDate_string = toDate.format('DD/MM/YYYY')
  const [sentimentDistribution, setSentimentDistribution] = useState<Record<string, string>>({});
  const order: Record<string, string> = { "Excited": "darkgreen", "Satisfied": "green", "Neutral": "grey", "Unsatisfied": "orange", "Frustrated": "red" };

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
    fetch(`${urlPrefix}/analytics/get_sentiments_distribution?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`)
      .then((response) => response.json())
      .then((data: {sentiment: string, count: number}[]) => {
        const totalSentiments = data.reduce((sum, item) => sum + item.count, 0);
        const sentimentPercentages: Record<string, string> = {};
        data.forEach((item) => {
          const percentage = ((item.count / totalSentiments) * 100).toFixed(1);
          sentimentPercentages[item.sentiment] = percentage;
        });
        setSentimentDistribution(sentimentPercentages);
      })

  }, [fromDate, toDate, selectedProduct, selectedSource]);

  const theme = useTheme();

  return (
    <div>
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
        height: '100%',
        "&:hover": {
          backgroundColor: "#f0f0f0", 
        },
      }}
      id="sentiment-distribution"
      onClick={() => setSelectedMenu("analytics")} >
      <Typography variant="h6" color="grey">Distribution of Sentiment</Typography>
      {Object.entries(order).reverse().map(([sentiment, sentimentColor]) => (
        <Typography key={sentiment} variant="body1" style={{ color: sentimentColor }}>
          {sentimentDistribution[sentiment] ? `${sentimentDistribution[sentiment]}% ` : '0% '}{sentiment}
        </Typography>
      ))}
    </ButtonBase>
  </div>
  );
}
