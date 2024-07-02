import { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface OverallSentimentScoreProps {
  fromDate: Dayjs;
  toDate: Dayjs;
  selectedProduct: string[];
  selectedSource: string[];
}

export default function OverallSentimentScore({
fromDate, toDate, selectedProduct, selectedSource
}: OverallSentimentScoreProps) {
  const fromDate_string = fromDate.format('DD/MM/YYYY')
  const toDate_string = toDate.format('DD/MM/YYYY')
  const [overallSentimentScore, setOverallSentimentScore] = useState<number>(0);
  const [overallSentimentScoreChange, setOverallSentimentScoreChange] = useState<number>(0);

  useEffect(() => {
    console.log("====> process.env", process.env.NODE_ENV);
    const urlPrefix =
      process.env.NODE_ENV == "development" ? "http://localhost:3000" : "";
      console.log(fromDate_string, toDate_string, selectedProduct,selectedSource)
    fetch(`${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`)
      .then((response) => {
        console.log(response.json())
        return response.json()
      })
      .then((data: Record<string, string | number>[]) => {
        console.log(data)
        const dates: string[] = data.map(item => item.date as string);
        const totalScore = data.reduce((sum, item) => {
          const score = parseFloat(item.sentiment_score as string);
          return sum + (isNaN(score) ? 0 : score);
        }, 0);
        const avgScore = totalScore / dates.length;
        setOverallSentimentScore(parseFloat(avgScore.toFixed(1)))
      });

    const prevFromDate_string = dayjs(fromDate).subtract(dayjs(toDate).diff(dayjs(fromDate), 'day'), 'day').format('DD/MM/YYYY');
    fetch(`${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${prevFromDate_string}&toDate=${fromDate_string}&product=${selectedProduct}&source=${selectedSource}`)
    .then((response) => response.json())
    .then((data: Record<string, string | number>[]) => {
      const dates: string[] = data.map(item => item.date as string);
      const totalScore = data.reduce((sum, item) => {
        const score = parseFloat(item.sentiment_score as string);
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      const avgScore = totalScore / dates.length;
      const prevOverallSentimentScore = avgScore;
      setOverallSentimentScoreChange(parseFloat(((overallSentimentScore - prevOverallSentimentScore)/100).toFixed(1)))
    });
  }, [fromDate, toDate, selectedProduct, selectedSource]);

  const theme = useTheme();

  return (
    <div>
      <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }} id="overall-sentiment-score">
        <Typography variant="h6" color="grey">Overall Sentiment Score</Typography>
        <Typography variant="h4" color="black">{overallSentimentScore}/5</Typography>
        <Typography variant="subtitle1" color={overallSentimentScoreChange > 0 ? "darkgreen" : "red"}> {overallSentimentScoreChange > 0 ? `↑ ${overallSentimentScoreChange}% Increase` : `↓ ${overallSentimentScoreChange}% Decrease`} </Typography>
      </Paper>
    </div>
  );
}
