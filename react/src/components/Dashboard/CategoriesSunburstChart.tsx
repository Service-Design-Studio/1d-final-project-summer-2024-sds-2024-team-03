import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Paper, Typography, ButtonBase} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";

interface CategoriesSunburstChartProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategoriesSunburstChart({
    fromDate,
    toDate,
    selectedProduct,
    selectedSource,
    setSelectedMenu,
}: CategoriesSunburstChartProps) {
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");
    const [overallSentimentScore, setOverallSentimentScore] =
        useState<number>(0);
    const [overallSentimentScoreChange, setOverallSentimentScoreChange] =
        useState<number>(0);

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(
            `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        )
            .then((response) => response.json())
            .then((data: Record<string, string>[]) => {
                console.log(`CURR:`);
                console.log(data);
                const dates: string[] = data.map((item) => item.date as string);
                const totalScore = data.reduce((sum, item) => {
                    const score = parseFloat(item.sentiment_score as string);
                    return sum + (isNaN(score) ? 0 : score);
                }, 0);
                const avgScore = totalScore / dates.length;
                console.log(avgScore);
                setOverallSentimentScore(parseFloat(avgScore.toFixed(1)));

                const prevFromDate_string = dayjs(fromDate)
                    .subtract(dayjs(toDate).diff(dayjs(fromDate), "day"), "day")
                    .format("DD/MM/YYYY");
                fetch(
                    `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${prevFromDate_string}&toDate=${fromDate_string}&product=${selectedProduct}&source=${selectedSource}`
                )
                    .then((response) => response.json())
                    .then((data: Record<string, string>[]) => {
                        console.log(`PREV:`);
                        console.log(data);
                        const dates: string[] = data.map(
                            (item) => item.date as string
                        );
                        const totalScore = data.reduce((sum, item) => {
                            const score = parseFloat(
                                item.sentiment_score as string
                            );
                            return sum + (isNaN(score) ? 0 : score);
                        }, 0);
                        const prevAvgScore = totalScore / dates.length;
                        const prevOverallSentimentScore = prevAvgScore;
                        console.log(prevOverallSentimentScore);
                        // increase/decrease from prevOverallSentimentScore -> overallSentimentScore
                        if (prevOverallSentimentScore !== 0) {
                            setOverallSentimentScoreChange(
                                parseFloat(
                                    (
                                        (100 *
                                            (avgScore -
                                                prevOverallSentimentScore)) /
                                        prevOverallSentimentScore
                                    ).toFixed(1)
                                )
                            );
                        }
                    });
            });
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
                    "&:hover": {
                        backgroundColor: "#f0f0f0",
                    },
                }}
                id="overall-sentiment-score"
                onClick={() => setSelectedMenu("analytics")}
            >
                <Typography variant="h6" color="grey">
                    Overall Sentiment Score
                </Typography>
                <Typography variant="h4" color="black">
                    {overallSentimentScore ? overallSentimentScore : 0}/5
                </Typography>
                <Typography
                    variant="subtitle1"
                    color={
                        overallSentimentScoreChange &&
                        overallSentimentScoreChange > 0
                            ? "darkgreen"
                            : overallSentimentScoreChange &&
                              overallSentimentScoreChange < 0
                            ? "red"
                            : "grey"
                    }
                >
                    {overallSentimentScoreChange &&
                    overallSentimentScoreChange > 0
                        ? `↑ ${overallSentimentScoreChange}% Increase`
                        : overallSentimentScoreChange &&
                          overallSentimentScoreChange < 0
                        ? `↓ ${overallSentimentScoreChange}% Decrease`
                        : `Not Applicable`}
                </Typography>
            </ButtonBase>
        </div>
    );
}
