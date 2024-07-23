import React, {useEffect, useState, forwardRef} from "react";
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

const ORDER: Record<string, string> = {
    Excited: "darkgreen",
    Satisfied: "green",
    Neutral: "grey",
    Unsatisfied: "orange",
    Frustrated: "red",
};

export default forwardRef(function CategoriesSunburstChart(
    {
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        setSelectedMenu,
    }: CategoriesSunburstChartProps,
    ref: React.Ref<HTMLDivElement>
) {
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

    interface CategoryNode {
        category: string;
        color: string;
        children?: CategoryNode[];
        mentions?: number;
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

    const getColorByOrder = (
        score: number,
        order: Record<string, string>
    ): string => {
        if (score <= 1) return order["Frustrated"];
        if (score <= 2) return order["Unsatisfied"];
        if (score <= 3) return order["Neutral"];
        if (score <= 4) return order["Satisfied"];
        return order["Excited"];
    };
    const theme = useTheme();

    const feedbackcategoryHashToHue = (feedbackcategory: string) => {
        let hash = 0;
        if (feedbackcategory) {
            for (let i = 0; i < feedbackcategory.length; i++) {
                hash = feedbackcategory.charCodeAt(i) + ((hash << 5) - hash);
            }
            return Math.abs(hash) % 360;
        }
        return 0;
    };

    const topCategories = averageSentimentScores
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 3);

    const mapCategoryToColor = (
        nodes: CategoryNode[]
    ): Record<string, string> => {
        const categoryColorMap: Record<string, string> = {};
        const traverse = (nodes: CategoryNode[]) => {
            nodes.forEach((node) => {
                categoryColorMap[node.category] = node.color;
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        traverse(nodes);
        return categoryColorMap;
    };

    const barColors = mapCategoryToColor(components);

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
                                    color: `hsl(${feedbackcategoryHashToHue(
                                        product
                                    )}, 70%, 50%)`,
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
                                    color: `hsl(${feedbackcategoryHashToHue(
                                        subcategory
                                    )}, 70%, 50%)`,
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
                                    color: `hsl(${feedbackcategoryHashToHue(
                                        feedback_category
                                    )}, 70%, 50%)`,
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

                    setComponents(Array.from(productMap.values()));
                    setAverageSentimentScores(
                        Array.from(avgSentimentScoresMap.values())
                    );
                    console.log(Array.from(productMap.values()));
                    console.log(Array.from(avgSentimentScoresMap.values()));
                } else {
                    setComponents([]);
                    setAverageSentimentScores([]);
                }
            });
    }, [fromDate, toDate, selectedProduct, selectedSource]);

    /* Must have parent container with a defined size */
    return (
        <Box
            ref={ref}
            sx={{
                display: "flex",
                gap: 2,
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
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 4,
                    flex: 1,
                    cursor: "pointer",
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#151515" : "#ffffff",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#1a1a1a"
                                : "#f9f9f9",
                        transform: "scaleX(1.02) scaleY(1.03)",
                    },
                }}
                id="overall-categoriessunburstchart"
                onClick={() => setSelectedMenu!("analytics")}
            >
                <Typography
                    variant="h6"
                    sx={{width: "100%", fontWeight: "bold"}}
                >
                    Distribution of Categories
                </Typography>
                {components.length === 0 ? (
                    <Typography variant="body2" color="grey">
                        No data
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            width: "100%",
                            height: 600,
                        }}
                    >
                        <ResponsiveSunburst
                            data={{
                                children: components,
                            }}
                            id="category"
                            value="mentions"
                            cornerRadius={2}
                            borderWidth={2}
                            borderColor={{theme: "grid.line.stroke"}}
                            colors={(bar) => barColors[bar.id]}
                            // To make use of hsl from each component
                            inheritColorFromParent={false}
                            // colors={{scheme: "paired"}}
                            childColor={{
                                from: "color",
                                modifiers: [["brighter", 0.3]],
                            }}
                            enableArcLabels={false}
                            // category or %
                            // arcLabel="id/formattedValue"
                            arcLabelsRadiusOffset={0.35}
                            arcLabelsSkipAngle={60}
                            arcLabelsTextColor={{theme: "labels.text.fill"}}
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
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 1,
                                width: "100%",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="div"
                                sx={{gridColumn: "1 / span 1"}}
                            >
                                Categories
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="div"
                                sx={{
                                    textAlign: "center",
                                    gridColumn: "2 / span 1",
                                }}
                            >
                                Total Mentions
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="div"
                                sx={{
                                    textAlign: "right",
                                    gridColumn: "3 / span 1",
                                }}
                            >
                                Avg Sentiment
                            </Typography>
                            <Box
                                sx={{
                                    gridColumn: "1 / span 3",
                                    borderBottom: "1px solid #ccc",
                                }}
                            />
                            {topCategories.map((category, index) => (
                                <React.Fragment key={index}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gridColumn: "1 / span 1",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    barColors[
                                                        category
                                                            .feedback_category
                                                    ],
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{ml: 1}}
                                        >
                                            {category.product} &gt;{" "}
                                            {category.subcategory} &gt;{" "}
                                            {category.feedback_category}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            gridColumn: "2 / span 1",
                                            textAlign: "center",
                                        }}
                                    >
                                        {category.mentions}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            gridColumn: "3 / span 1",
                                            textAlign: "right",
                                            color: getColorByOrder(
                                                category.averageSentimentScore,
                                                ORDER
                                            ),
                                        }}
                                    >
                                        {category.averageSentimentScore.toFixed(
                                            1
                                        )}{" "}
                                        / 5.0
                                    </Typography>
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                )}
            </ButtonBase>
        </Box>
    );
});
