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
    Rating,
    Tooltip,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
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
    Promoter: "darkgreen",
    Satisfied: "green",
    Neutral: "grey",
    Unsatisfied: "orange",
    Frustrated: "red",
};

type CustomRef<T> = {
    img: T;
    reportDesc?: string;
};

export default forwardRef(function CategoriesSunburstChart(
    {
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        setSelectedMenu,
    }: CategoriesSunburstChartProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
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
        if (score <= 2.5) return order["Unsatisfied"];
        if (score <= 3.5) return order["Neutral"];
        if (score <= 4.5) return order["Satisfied"];
        return order["Promoter"];
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
                                    )}, 80%, 40%)`,
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
                                    )}, 80%, 40%)`,
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
                                    )}, 80%, 40%)`,
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

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc:
                topCategories.length > 0
                    ? `The top 3 most mentioned:\n${topCategories
                          .map(
                              (category) =>
                                  `   • ${category.subcategory} | ${
                                      category.feedback_category
                                  } has ${
                                      category.mentions
                                  } total mentions, with an average sentiment score of ${category.averageSentimentScore.toFixed(
                                      1
                                  )} / 5.\n`
                          )
                          .join("")}`
                    : "No data",
        }),
        [topCategories] // Adjust the dependency array if necessary
    );

    /* Must have parent container with a defined size */
    return (
        <Tooltip
            title={
                <Box
                    sx={{
                        width: 300,
                        height: 400,
                    }}
                >
                    <span>
                        The chart represents the corresponding frequency of
                        Products, Subcategories and Feedback Categories
                        <br />
                        <br />
                        <b>Hover</b> for more information
                    </span>
                    <ResponsiveSunburst
                        data={{
                            children: [
                                {
                                    key: "Product",
                                    color: "hsl(297, 70%, 50%)",
                                    children: [
                                        {
                                            key: "Subcategory",
                                            color: "hsl(201, 70%, 50%)",
                                            children: [
                                                {
                                                    key: "Feedback Category",
                                                    color: "hsl(81, 70%, 50%)",
                                                    value: 100,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        }}
                        margin={{
                            bottom: 60,
                            right: 15,
                        }}
                        id="key"
                        value="value"
                        cornerRadius={2}
                        borderWidth={2}
                        borderColor={
                            theme.palette.mode === "dark" ? "#222222" : "#fff"
                        }
                        colors={{scheme: "pastel2"}}
                        inheritColorFromParent={false}
                        childColor={{
                            from: "color",
                            modifiers: [["brighter", 0.3]],
                        }}
                        enableArcLabels={true}
                        arcLabel="id"
                        arcLabelsRadiusOffset={0.35}
                        arcLabelsTextColor="black"
                        animate={false}
                        tooltip={({id, value, color, percentage}) => (
                            <Paper
                                sx={{
                                    padding: "9px 12px",
                                    borderRadius: "10px",
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "#111"
                                            : "#fff",
                                    boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                    color:
                                        theme.palette.mode === "dark"
                                            ? "#fff"
                                            : "#000",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    style={{
                                        color,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {id ?? "Unspecified"}
                                </Typography>
                                <Typography variant="body2">
                                    {value} ({Math.round(percentage * 10) / 10}
                                    %)
                                </Typography>
                            </Paper>
                        )}
                    />
                </Box>
            }
            placement="left-start"
            arrow
        >
            <Box
                ref={internalRef}
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
                        justifyContent: "start",
                        // minHeight: 800,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        gap: 4,
                        borderRadius: 4,
                        flex: 1,
                        cursor: "pointer",
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor:
                            theme.palette.mode === "dark" ? "#151515" : "#fff",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "#1a1a1a"
                                    : "#f9f9f9",
                            transform: "scaleX(1.01) scaleY(1.01)",
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
                                width: "95%",
                                height: 300,
                            }}
                        >
                            <ResponsiveSunburst
                                data={{
                                    children: components,
                                }}
                                id="category"
                                value="mentions"
                                cornerRadius={2}
                                borderWidth={4}
                                // background / grid.line.stroke / labels.text.fill / "color" / "#..."
                                borderColor={
                                    theme.palette.mode === "dark"
                                        ? "#222222"
                                        : "#fff"
                                }
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
                                animate={false}
                                tooltip={({id, value, color, percentage}) => (
                                    <Paper
                                        sx={{
                                            padding: "9px 12px",
                                            borderRadius: "10px",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "#111"
                                                    : "#fff",
                                            boxShadow:
                                                "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                            color:
                                                theme.palette.mode === "dark"
                                                    ? "#fff"
                                                    : "#000",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            style={{color, fontWeight: "bold"}}
                                        >
                                            {id ?? "Unspecified"}
                                        </Typography>
                                        <Typography variant="body2">
                                            {value} (
                                            {Math.round(percentage * 10) / 10}%)
                                        </Typography>
                                    </Paper>
                                )}
                            />
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "4fr 3fr 3fr",
                                    gap: 1,
                                    width: "100%",
                                    alignItems: "center",
                                    mt: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        gridColumn: "1 / span 3",
                                        borderBottom: `2px solid ${
                                            theme.palette.mode === "dark"
                                                ? "#444"
                                                : "#ccc"
                                        }`,
                                        mb: 1.5,
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    component="div"
                                    sx={{
                                        gridColumn: "1 / span 1",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                        pl: 2,
                                    }}
                                >
                                    Categories
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    component="div"
                                    sx={{
                                        textAlign: "center",
                                        gridColumn: "2 / span 1",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Total Mentions
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    component="div"
                                    sx={{
                                        gridColumn: "3 / span 1",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        pr: 2,
                                    }}
                                >
                                    Avg. Sentiment
                                </Typography>
                                {topCategories.map((category, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            p: 1.5,
                                            my: 0.5,
                                            borderRadius: 3,
                                            bgcolor:
                                                theme.palette.mode === "dark"
                                                    ? "#151515"
                                                    : "#eee",
                                            gridColumn: "1 / span 3", // Ensure full width for each row
                                            "&:hover": {
                                                backgroundColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#0d0d0d"
                                                        : "#ddd",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gridColumn: "1 / span 1",
                                                width: "40%",
                                            }}
                                        >
                                            <Box
                                            /*
                                        sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: "50%",
                                            backgroundColor: barColors[category.feedback_category],
                                            flexShrink: 0,
                                        }}
                                        */
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ml: 1, textAlign: "left"}}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "1.1rem",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {category.product
                                                        ? category.product
                                                        : "Unspecified"}
                                                </span>
                                                <br />
                                                <span
                                                    style={{
                                                        color: "grey",
                                                        fontSize: "1rem",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {category.subcategory
                                                        ? category.subcategory
                                                        : "Unspecified"}
                                                </span>
                                                <br />
                                                <span
                                                    style={{
                                                        color: barColors[
                                                            category
                                                                .feedback_category
                                                        ],
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {category.feedback_category
                                                        ? category.feedback_category
                                                        : "Unspecified"}
                                                </span>
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                gridColumn: "2 / span 1",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                fontSize: "1.3rem",
                                                width: "30%",
                                            }}
                                        >
                                            {category.mentions}
                                        </Typography>
                                        <Box
                                            sx={{
                                                ml: 1.5,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center", // Center items horizontally
                                                justifyContent: "center", // Center items vertically if needed
                                                textAlign: "center", // Center text alignment
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    gridColumn: "3 / span 1",
                                                    textAlign: "center",
                                                    color: getColorByOrder(
                                                        category.averageSentimentScore,
                                                        ORDER
                                                    ),
                                                    fontWeight: "bold",
                                                    fontSize: "1.3rem",
                                                    width: "30%",
                                                }}
                                            >
                                                {category.averageSentimentScore.toFixed(
                                                    1
                                                )}
                                            </Typography>
                                            <Rating
                                                name="read-only"
                                                value={
                                                    category.averageSentimentScore
                                                } // Assuming averageSentimentScore is between 0 and 5
                                                precision={0.1} // Adjust the precision if needed
                                                readOnly
                                                size="small" // Adjust the size as needed
                                                sx={{
                                                    color:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#666"
                                                            : "#999",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </ButtonBase>
            </Box>
        </Tooltip>
    );
});
