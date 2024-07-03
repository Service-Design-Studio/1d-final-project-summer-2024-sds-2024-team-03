import { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

interface SentimentDistributionProps {
  fromDate: Dayjs;
  toDate: Dayjs;
  selectedProduct: string[];
  selectedSource: string[];
}

export default function SentimentDistribution({
fromDate, toDate, selectedProduct, selectedSource
}: SentimentDistributionProps) {
  const fromDate_string = fromDate.format('DD/MM/YYYY')
  const toDate_string = toDate.format('DD/MM/YYYY')
  const [sentimentDistribution, setSentimentDistribution] = useState<Record<string, string>>({});
  const order: Record<string, string> = { "Excited": "darkgreen", "Satisfied": "green", "Neutral": "white", "Unsatisfied": "orange", "Frustrated": "red" };

  useEffect(() => {
    console.log("====> process.env", process.env.NODE_ENV);
    const urlPrefix =
      process.env.NODE_ENV == "development" ? "http://localhost:3000" : "";
    fetch(`${urlPrefix}/analytics/get_sentiments_distribution?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`)
      .then((response) => response.json())
      .then((data: Record<string, number>) => {
        const totalSentiments = Object.values(data).reduce((sum, count) => sum + count, 0);
        const sentimentPercentages: Record<string, string> = {};
        Object.keys(data).forEach((sentiment) => {
          const count = data[sentiment];
          const percentage = ((count / totalSentiments) * 100).toFixed(1);
          sentimentPercentages[sentiment] = percentage;
        });
        setSentimentDistribution(sentimentPercentages);
      })
  }, [fromDate, toDate, selectedProduct, selectedSource]);

  const theme = useTheme();

  return (
    <Paper sx={{ p: 2, borderRadius: 2, flex: 1, alignItems: 'center', flexDirection: 'row' }} id="sentiment-distribution">
      <Typography variant="h6" color="grey">Distribution of Sentiment</Typography>
      {Object.entries(order).map(([sentiment, sentimentColor]) => (
        <Typography key={sentiment} variant="body1" style={{ color: sentimentColor }}>
          {sentimentDistribution[sentiment] ? `${sentimentDistribution[sentiment]}% ` : '0% '}{sentiment}
        </Typography>
      ))}
    </Paper>

  );
}
