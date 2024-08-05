import React, {
    useEffect,
    useState,
    forwardRef,
    ForwardedRef,
    useRef,
    useImperativeHandle,
} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Paper, Typography, Box, ButtonBase, Divider} from "@mui/material";
import {Dayjs} from "dayjs";

const MAXBARWIDTH = 110;

interface SentimentDistributionProps {
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

export default forwardRef(function SentimentDistribution(
    {
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        setSelectedMenu,
    }: SentimentDistributionProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");
    const [sentimentDistribution, setSentimentDistribution] = useState<
        Record<string, string>
    >({});
    const order: Record<string, string> = {
        Excited: "darkgreen",
        Satisfied: "green",
        Neutral: "darkgray",
        Unsatisfied: "orange",
        Frustrated: "red",
    };
    const theme = useTheme();

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(
            `${urlPrefix}/analytics/get_sentiments_distribution?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        )
            .then((response) => response.json())
            .then((data: {sentiment: string; count: number}[]) => {
                const totalSentiments = data.reduce(
                    (sum, item) => sum + item.count,
                    0
                );
                const sentimentPercentages: Record<string, string> = {};
                data.forEach((item) => {
                    const percentage = (
                        (item.count / totalSentiments) *
                        100
                    ).toFixed(1);
                    sentimentPercentages[item.sentiment] = percentage;
                });
                setSentimentDistribution(sentimentPercentages);
            });
    }, [fromDate, toDate, selectedProduct, selectedSource]);

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc: ``,
        }),
        [sentimentDistribution]
    );

    return (
        <ButtonBase
            ref={internalRef}
            component={Paper}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
            id="sentiment-distribution"
            onClick={() => setSelectedMenu("analytics")}
        >
            <Box sx={{width: "100%", justifyContent: "flex-start"}}>
                <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                    Distribution of Sentiment
                </Typography>
            </Box>
            <Box sx={{height: "100%"}}>
                {Object.entries(order)
                    .reverse()
                    .map(([sentiment, sentimentColor]) => {
                        const sentimentValue = parseFloat(
                            sentimentDistribution[sentiment] || "0"
                        );
                        const barWidth =
                            1.5 * (sentimentValue / 100) * MAXBARWIDTH;

                        return (
                            <Box sx={{display: "flex", mb: 1}} key={sentiment}>
                                <Typography
                                    sx={{mr: 1, textAlign: "right", width: 80}}
                                    variant="body1"
                                    color="grey"
                                >
                                    {sentiment}
                                </Typography>
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        borderRightWidth: 2,
                                        borderColor: "black",
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: MAXBARWIDTH,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            borderTopRightRadius: 10,
                                            borderBottomRightRadius: 10,
                                            backgroundColor: sentimentColor,
                                            width: barWidth, // Adjusted width based on percentage
                                            height: "20px", // Ensure visibility of the bar
                                        }}
                                    ></Box>
                                    <Typography
                                        sx={{ml: 1, width: 45}}
                                        variant="body1"
                                        color="grey"
                                    >
                                        {sentimentDistribution[sentiment]
                                            ? `${sentimentDistribution[sentiment]}%`
                                            : "0%"}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
        </ButtonBase>
    );
});
