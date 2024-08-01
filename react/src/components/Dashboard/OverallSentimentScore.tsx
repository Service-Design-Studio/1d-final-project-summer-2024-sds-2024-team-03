import React, {
    useEffect,
    useState,
    forwardRef,
    ForwardedRef,
    useRef,
    useImperativeHandle,
} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {
    Paper,
    Box,
    Typography,
    ButtonBase,
    Tooltip,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import dayjs, {Dayjs} from "dayjs";

interface OverallSentimentScoreProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

type CustomRef<T> = {
    img: T;
    reportDesc?: string;
};

export default forwardRef(function OverallSentimentScore(
    {
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        setSelectedMenu,
    }: OverallSentimentScoreProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
    const theme = useTheme();
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");
    const prevFromDate_string = dayjs(fromDate)
        .subtract(dayjs(toDate).diff(dayjs(fromDate), "day"), "day")
        .format("DD/MM/YYYY");
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
                // console.log(`CURR:`);
                // console.log(data);
                const dates: string[] = data.map((item) => item.date as string);
                const totalScore = data.reduce((sum, item) => {
                    const score = parseFloat(item.sentiment_score as string);
                    return sum + (isNaN(score) ? 0 : score);
                }, 0);
                const avgScore = totalScore / dates.length;
                // console.log(avgScore);
                setOverallSentimentScore(parseFloat(avgScore.toFixed(1)));

                fetch(
                    `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${prevFromDate_string}&toDate=${fromDate_string}&product=${selectedProduct}&source=${selectedSource}`
                )
                    .then((response) => response.json())
                    .then((data: Record<string, string>[]) => {
                        // console.log(`PREV:`);
                        // console.log(data);
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
                        // console.log(prevOverallSentimentScore);
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

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc: `There was an overall sentiment score of ${overallSentimentScore} / 5, which was a ${overallSentimentScoreChange}% ${
                overallSentimentScoreChange > 0
                    ? "increase"
                    : overallSentimentScoreChange < 0
                    ? "decrease"
                    : "change"
            } compared to the same duration from ${dayjs(
                prevFromDate_string,
                "DD/MM/YYYY"
            ).format("DD MMM' YY")} - ${dayjs(
                fromDate_string,
                "DD/MM/YYYY"
            ).format("DD MMM' YY")}.`,
        }),
        [overallSentimentScore, overallSentimentScoreChange, fromDate]
    );

    return (
        <ButtonBase
            ref={internalRef}
            component={Paper}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 4,
                flex: 1,
                cursor: "pointer",
                height: "100%",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor:
                    theme.palette.mode === "dark" ? "#151515" : "#ffffff",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#1a1a1a" : "#f9f9f9",
                    transform: "scale(1.03)",
                },
            }}
            id="overall-sentiment-score"
            onClick={() => setSelectedMenu("analytics")}
        >
            <Box
                sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    display: "flex",
                }}
            >
                <Tooltip
                    title={
                        <span>
                            Displays the averaged sentiment score of all VOCUS
                            and compares it to an equal duration:
                            <br /> {prevFromDate_string} - {fromDate_string}
                        </span>
                    }
                    arrow
                >
                    <IconButton>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" style={{fontWeight: "bold"}}>
                    Overall Sentiment Score
                </Typography>
            </Box>
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Typography sx={{fontSize: "4rem", fontWeight: "bold"}}>
                    {overallSentimentScore ? overallSentimentScore : 0}
                </Typography>
                <Typography
                    sx={{ml: 1, mt: 3, fontSize: "2.5rem"}}
                    color="grey"
                >
                    / 5
                </Typography>
            </Box>
            <Box
                sx={{
                    borderRadius: 4,
                    backgroundColor:
                        overallSentimentScoreChange &&
                        overallSentimentScoreChange > 0
                            ? "darkgreen" // Light green background for increase
                            : overallSentimentScoreChange &&
                              overallSentimentScoreChange < 0
                            ? "red" // Light red background for decrease
                            : "grey",
                    mb: 2,
                    width: 150,
                }}
            >
                <Typography
                    sx={{ml: 2, mr: 2, textAlign: "center"}}
                    variant="subtitle1"
                    color="white"
                >
                    {overallSentimentScoreChange &&
                    overallSentimentScoreChange > 0
                        ? `▲ ${overallSentimentScoreChange}%`
                        : overallSentimentScoreChange &&
                          overallSentimentScoreChange < 0
                        ? `▼ ${-overallSentimentScoreChange}%`
                        : `Not Applicable`}
                </Typography>
            </Box>
        </ButtonBase>
    );
});
