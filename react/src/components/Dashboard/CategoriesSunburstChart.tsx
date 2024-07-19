import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Paper, Box, Typography, ButtonBase} from "@mui/material";
import {Dayjs} from "dayjs";
import {ResponsiveSunburst} from "@nivo/sunburst";

interface CategoriesSunburstChartProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
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
    interface FeedbackCategory {
        category: string;
        color: string;
        mentions: number;
    }

    interface Subcategory {
        category: string;
        color: string;
        children: FeedbackCategory[];
    }

    interface Product {
        category: string;
        color: string;
        children: Subcategory[];
    }

    interface AverageSentimentScore {
        product: string;
        subcategory: string;
        feedback_category: string;
        averageSentimentScore: number;
        totalSentimentScore: number;
        mentions: number;
    }

    const [components, setComponents] = useState<Product[]>([]);
    const [averageSentimentScores, setAverageSentimentScores] = useState<
        AverageSentimentScore[]
    >([]);
    const theme = useTheme();

    const feedbackcategoryHashToHue = (feedbackcategory: string) => {
        let hash = 0;
        for (let i = 0; i < feedbackcategory.length; i++) {
            hash = feedbackcategory.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash % 360;
    };

    const getAverageSentimentScore = (
        product: string,
        subcategory: string,
        feedback_category: string
    ): number | 0 => {
        const avgSentimentScore = averageSentimentScores.find(
            (score) =>
                score.product === product &&
                score.subcategory === subcategory &&
                score.feedback_category === feedback_category
        );
        return avgSentimentScore ? avgSentimentScore.averageSentimentScore : 0;
    };

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(
            `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        )
            .then((response) => response.json())
            .then((data: Record<string, string>[]) => {
                if (data.length > 0) {
                    const productMap = new Map<string, Product>();
                    const avgSentimentScoresMap = new Map<
                        string,
                        AverageSentimentScore
                    >();

                    data.forEach(
                        ({
                            product,
                            subcategory,
                            feedback_category,
                            sentiment_score,
                        }) => {
                            const score = parseFloat(sentiment_score);
                            const key = `${product}_${subcategory}_${feedback_category}`;

                            if (!avgSentimentScoresMap.has(key)) {
                                avgSentimentScoresMap.set(key, {
                                    product,
                                    subcategory,
                                    feedback_category,
                                    averageSentimentScore: 0,
                                    totalSentimentScore: 0,
                                    mentions: 0,
                                });
                            }

                            const avgSentimentScore =
                                avgSentimentScoresMap.get(key)!;
                            avgSentimentScore.totalSentimentScore += score;
                            avgSentimentScore.mentions += 1;
                            avgSentimentScore.averageSentimentScore =
                                avgSentimentScore.totalSentimentScore /
                                avgSentimentScore.mentions;

                            if (!productMap.has(product)) {
                                productMap.set(product, {
                                    category: product,
                                    color: "hsl(189, 70%, 50%)",
                                    children: [],
                                });
                            }

                            const productNode = productMap.get(product);
                            const subcategoryMap = productNode!.children;

                            let subcategoryNode = subcategoryMap.find(
                                (child) => child.category === subcategory
                            );
                            if (!subcategoryNode) {
                                subcategoryNode = {
                                    category: subcategory,
                                    color: "hsl(189, 70%, 50%)",
                                    children: [],
                                };
                                subcategoryMap.push(subcategoryNode);
                            }

                            const feedbackMap = subcategoryNode.children;
                            let feedbackNode = feedbackMap.find(
                                (child) => child.category === feedback_category
                            );
                            if (!feedbackNode) {
                                feedbackNode = {
                                    category: feedback_category,
                                    color: "hsl(189, 70%, 50%)",
                                    mentions: 0,
                                };
                                feedbackMap.push(feedbackNode);
                            }

                            // feedbackNode.totalSentimentScore +=
                            //     parseFloat(sentiment_score);
                            feedbackNode.mentions += 1;
                        }
                    );

                    // productMap.forEach((product) => {
                    //     product.children.forEach((subcategory) => {
                    //         subcategory.children.forEach((feedback) => {
                    //             feedback.averageSentimentScore =
                    //                 feedback.totalSentimentScore /
                    //                 feedback.mentions;
                    //         });
                    //     });
                    // });

                    console.log(productMap);
                    console.log(avgSentimentScoresMap);
                    setComponents(Array.from(productMap.values()));
                    setAverageSentimentScores(
                        Array.from(avgSentimentScoresMap.values())
                    );
                    console.log(Array.from(productMap.values()));
                    console.log(Array.from(avgSentimentScoresMap.values()));
                    console.log(
                        getAverageSentimentScore(
                            "cards",
                            "Credit Card Fraud/Scam",
                            "Fee Related"
                        )
                    );
                } else {
                    setComponents([]);
                    setAverageSentimentScores([]);
                }
            });
    }, [fromDate, toDate, selectedProduct, selectedSource]);

    /* Must have parent container with a defined size */
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                width: "100%",
                flexDirection: "row",
            }}
        >
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
                id="overall-categoriessunburstchart"
                onClick={() => setSelectedMenu!("analytics")}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                        width: "100%",
                        flexDirection: "row",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{marginRight: 2, width: "50%"}}
                    >
                        Sentiment vs Categories
                    </Typography>
                </Box>
                {/* {components.length === 0 ? (
                    <Typography variant="body2" color="grey">
                        No data
                    </Typography>
                ) :  */}
                (
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                        width: "100%",
                        height: 200,
                    }}
                >
                    <ResponsiveSunburst
                        data={{
                            category: "nivo",
                            color: "hsl(265, 70%, 50%)",
                            children: components,
                        }}
                        margin={{top: 10, right: 10, bottom: 10, left: 10}}
                        id="category"
                        value="mentions"
                        cornerRadius={2}
                        borderColor={{theme: "background"}}
                        colors={{scheme: "paired"}}
                        childColor={{
                            from: "color",
                            modifiers: [["brighter", 0.1]],
                        }}
                        enableArcLabels={true}
                        arcLabelsSkipAngle={15}
                        arcLabelsTextColor={{
                            from: "color",
                            modifiers: [["darker", 1.4]],
                        }}
                        // tooltip={(e) =>
                        //     t.createElement(
                        //         l,
                        //         {style: {color: e.color}},
                        //         t.createElement(u, null, "id"),
                        //         t.createElement(c, null, e.id),
                        //         t.createElement(u, null, "value"),
                        //         t.createElement(c, null, e.value),
                        //         t.createElement(u, null, "percentage"),
                        //         t.createElement(
                        //             c,
                        //             null,
                        //             Math.round(100 * e.percentage) / 100,
                        //             "%"
                        //         ),
                        //         t.createElement(u, null, "color"),
                        //         t.createElement(c, null, e.color)
                        //     )
                        // }
                    />
                </Box>
                ){/* } */}
            </ButtonBase>
        </Box>
    );
}
