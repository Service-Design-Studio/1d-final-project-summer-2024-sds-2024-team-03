import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {
    Paper,
    Box,
    Typography,
    ButtonBase,
    Divider,
    Button,
} from "@mui/material";
import {Dayjs} from "dayjs";
import {ResponsiveBar} from "@nivo/bar";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import DialogSentimentCategoriesGraph from "./DialogSentimentCategoriesGraph";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            borderRadius: 18,
            marginTop: "18px",
        },
    },
};
const ORDER: Record<string, string> = {
    Excited: "darkgreen",
    Satisfied: "green",
    Neutral: "grey",
    Unsatisfied: "orange",
    Frustrated: "red",
};

interface SentimentCategoriesGraphProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    isDetailed: boolean;
    setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
}

export default function SentimentCategoriesGraph({
    fromDate,
    toDate,
    selectedProduct,
    selectedSource,
    isDetailed,
    setSelectedMenu,
}: SentimentCategoriesGraphProps) {
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");

    type DataRecord = {
        sentiment_score: string;
        product: string;
        subcategory: string;
        feedback_category: string;
    };

    type Bar = {
        category: string;
        Frustrated: number;
        FrustratedColor: string;
        Unsatisfied: number;
        UnsatisfiedColor: string;
        Neutral: number;
        NeutralColor: string;
        Satisfied: number;
        SatisfiedColor: string;
        Excited: number;
        ExcitedColor: string;
    };

    const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [bars, setBars] = useState<Bar[]>([]);
    const [sortPositive, setSortPositive] = useState<boolean>(true);
    const [viewAll, setViewAll] = useState(false);

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

    const convertDate = (dateString: string) => {
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`).getTime();
    };

    const formatDate = (dateString: string): string => {
        const [day, month, year] = dateString.split("/").map(Number);
        // months in JavaScript Date are zero-indexed
        const date = new Date(year, month - 1, day);
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "2-digit",
        };
        const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
            date
        );
        return formattedDate;
    };

    const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
        const {
            target: {value},
        } = event;
        setSelectedSubcategory(value);
    };

    const sortBySentiment = (
        records: Bar[],
        negative: boolean = false
    ): Bar[] => {
        return records.sort((a, b) => {
            const aValues = [
                a.Frustrated,
                a.Unsatisfied,
                a.Satisfied,
                a.Excited,
            ];
            const bValues = [
                b.Frustrated,
                b.Unsatisfied,
                b.Satisfied,
                b.Excited,
            ];

            if (negative) {
                for (let i = 0; i < 2; i++) {
                    // Only consider Frustrated and Unsatisfied
                    if (aValues[i] !== bValues[i]) {
                        return aValues[i] - bValues[i];
                    }
                }
            } else {
                for (let i = 3; i > 1; i--) {
                    // For highest to lowest positive, only consider Satisfied and Excited
                    if (aValues[i] !== bValues[i]) {
                        return aValues[i] - bValues[i];
                    }
                }
            }
            return 0;
        });
    };

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        if (
            !fromDate ||
            !toDate ||
            selectedProduct.length === 0 ||
            selectedSource.length === 0 ||
            !selectedSubcategory
        )
            setBars([]);
        if (isDetailed) {
            fetch(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            )
                .then((response) => response.json())
                .then((data: DataRecord[]) => {
                    if (data.length > 0) {
                        setGraphSubcategories(
                            Array.from(
                                new Set(
                                    data.map(({subcategory}) => subcategory)
                                )
                            )
                        );
                        const filteredSubcategories = data.filter((item) => {
                            if (item.subcategory)
                                return selectedSubcategory.includes(
                                    item.subcategory
                                );
                        });
                        const dataGroupedByFeedbackcategory: Record<
                            string,
                            DataRecord[]
                        > = filteredSubcategories.reduce((acc, curr) => {
                            const key = `${curr.subcategory} > ${curr.feedback_category}`;
                            if (!acc[key]) {
                                acc[key] = [];
                            }
                            acc[key].push(curr);
                            return acc;
                        }, {} as Record<string, DataRecord[]>);

                        const barsData: Bar[] = Object.entries(
                            dataGroupedByFeedbackcategory
                        ).map(([key, records]) => {
                            const total = records.length;
                            const sentimentScores = records.map((r) =>
                                parseFloat(r.sentiment_score)
                            );
                            const frustratedRecords = sentimentScores.filter(
                                (score) => score <= 1
                            );
                            const unsatisfiedRecords = sentimentScores.filter(
                                (score) => score <= 2 && score > 1
                            );
                            const neutralRecords = sentimentScores.filter(
                                (score) => score <= 3 && score > 2
                            );
                            const satisfiedRecords = sentimentScores.filter(
                                (score) => score <= 4 && score > 3
                            );
                            const excitedRecords = sentimentScores.filter(
                                (score) => score > 4
                            );

                            return {
                                category: key,
                                Frustrated: parseFloat(
                                    (
                                        (100 * frustratedRecords.length) /
                                        total
                                    ).toFixed(1)
                                ),
                                FrustratedColor: getColorByOrder(
                                    frustratedRecords.reduce(
                                        (sum, score) => sum + score,
                                        0
                                    ) / frustratedRecords.length || 0,
                                    ORDER
                                ),
                                Unsatisfied: parseFloat(
                                    (
                                        (100 * unsatisfiedRecords.length) /
                                        total
                                    ).toFixed(1)
                                ),
                                UnsatisfiedColor: getColorByOrder(
                                    unsatisfiedRecords.reduce(
                                        (sum, score) => sum + score,
                                        0
                                    ) / unsatisfiedRecords.length || 0,
                                    ORDER
                                ),
                                Neutral: parseFloat(
                                    (
                                        (100 * neutralRecords.length) /
                                        total
                                    ).toFixed(1)
                                ),
                                NeutralColor: getColorByOrder(
                                    neutralRecords.reduce(
                                        (sum, score) => sum + score,
                                        0
                                    ) / neutralRecords.length || 0,
                                    ORDER
                                ),
                                Satisfied: parseFloat(
                                    (
                                        (100 * satisfiedRecords.length) /
                                        total
                                    ).toFixed(1)
                                ),
                                SatisfiedColor: getColorByOrder(
                                    satisfiedRecords.reduce(
                                        (sum, score) => sum + score,
                                        0
                                    ) / satisfiedRecords.length || 0,
                                    ORDER
                                ),
                                Excited: parseFloat(
                                    (
                                        (100 * excitedRecords.length) /
                                        total
                                    ).toFixed(1)
                                ),
                                ExcitedColor: getColorByOrder(
                                    excitedRecords.reduce(
                                        (sum, score) => sum + score,
                                        0
                                    ) / excitedRecords.length || 0,
                                    ORDER
                                ),
                            };
                        });
                        console.log(barsData);
                        setBars(barsData);
                    } else {
                        setBars([]);
                    }
                });
        } else {
            fetch(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            )
                .then((response) => response.json())
                .then((data: DataRecord[]) => {
                    if (data.length > 0) {
                        const dataGroupedByFeedbackcategory = data.reduce(
                            (
                                acc,
                                {
                                    subcategory,
                                    feedback_category,
                                    sentiment_score,
                                }
                            ) => {
                                const key = `${subcategory} > ${feedback_category}`;
                                (acc[key] = acc[key] || []).push(
                                    parseFloat(sentiment_score)
                                );
                                return acc;
                            },
                            {} as Record<string, number[]>
                        );

                        const barsDataFuncs = (
                            scores: number[],
                            total: number
                        ) => {
                            const average = (arr: number[]) =>
                                arr.reduce((sum, score) => sum + score, 0) /
                                    arr.length || 0;
                            return {
                                percentage: (count: number) =>
                                    parseFloat(
                                        ((100 * count) / total).toFixed(1)
                                    ),
                                averageScore: average(scores),
                                colors: {
                                    Frustrated: getColorByOrder(
                                        average(
                                            scores.filter((score) => score <= 1)
                                        ),
                                        ORDER
                                    ),
                                    Unsatisfied: getColorByOrder(
                                        average(
                                            scores.filter(
                                                (score) =>
                                                    score > 1 && score <= 2
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Neutral: getColorByOrder(
                                        average(
                                            scores.filter(
                                                (score) =>
                                                    score > 2 && score <= 3
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Satisfied: getColorByOrder(
                                        average(
                                            scores.filter(
                                                (score) =>
                                                    score > 3 && score <= 4
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Excited: getColorByOrder(
                                        average(
                                            scores.filter((score) => score > 4)
                                        ),
                                        ORDER
                                    ),
                                },
                            };
                        };

                        const barsData: Bar[] = Object.entries(
                            dataGroupedByFeedbackcategory
                        ).map(([key, scores]) => {
                            const total = scores.length;
                            const {percentage, colors} = barsDataFuncs(
                                scores,
                                total
                            );

                            return {
                                category: key,
                                Frustrated: percentage(
                                    scores.filter((score) => score <= 1).length
                                ),
                                FrustratedColor: colors.Frustrated,
                                Unsatisfied: percentage(
                                    scores.filter(
                                        (score) => score > 1 && score <= 2
                                    ).length
                                ),
                                UnsatisfiedColor: colors.Unsatisfied,
                                Neutral: percentage(
                                    scores.filter(
                                        (score) => score > 2 && score <= 3
                                    ).length
                                ),
                                NeutralColor: colors.Neutral,
                                Satisfied: percentage(
                                    scores.filter(
                                        (score) => score > 3 && score <= 4
                                    ).length
                                ),
                                SatisfiedColor: colors.Satisfied,
                                Excited: percentage(
                                    scores.filter((score) => score > 4).length
                                ),
                                ExcitedColor: colors.Excited,
                            };
                        });

                        console.log(barsData);
                        setBars(barsData);
                    } else {
                        setBars([]);
                    }
                });
        }
    }, [
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        selectedSubcategory,
    ]);

    /* Must have parent container with a defined size */
    return isDetailed ? (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                flexDirection: "row",
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    borderRadius: 4,
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                        transform: "scaleX(1.015) scaleY(1.03)",
                    },
                    flex: 1,
                }}
                id="detailed-sentimentcategoriesgraph"
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexGrow: 1,
                        }}
                    >
                        <Box sx={{display: "flex", justifyContent: "flex-start", flexGrow: 1,}}>
                            <Typography
                                variant="h6"
                                sx={{fontWeight: "bold", mr:1}}
                            >
                                Sentiment Categorisation
                            </Typography>
                            <Typography
                                variant="h6"
                            >
                                ({sortPositive ? "Positive" : "Negative"})
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => setSortPositive(!sortPositive)}
                            sx={{marginRight: 2}}
                        >
                            Sort
                        </Button>
                    </Box>
                    <FormControl sx={{m: 0, minWidth: 240}}>
                        <InputLabel id="detailed-sentimentcategoriesgraph-filter-subcategory-label">
                            Subcategories
                        </InputLabel>
                        <Select
                            labelId="detailed-sentimentcategoriesgraph-filter-subcategory-label"
                            id="detailed-sentimentcategoriesgraph-filter-subcategory"
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                            input={
                                <OutlinedInput
                                    id="detailed-sentimentcategoriesgraph-select-subcategory"
                                    label="Subcategory"
                                    sx={{borderRadius: 4}}
                                />
                            }
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                    }}
                                >
                                    <Chip key={selected} label={selected} />
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {graphSubcategories.length > 0 ? (
                                graphSubcategories.map((subcategory) => (
                                    <MenuItem
                                        key={subcategory}
                                        value={subcategory}
                                        className="subcategory-option"
                                    >
                                        {subcategory}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    No data from selection
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>
                {bars.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="grey"
                        sx={{marginTop: 2}}
                    >
                        No data
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            width: "100%",
                            height: 300,
                        }}
                    >
                        <ResponsiveBar
                            onClick={(data) => {
                                console.log("Bar clicked:", data);
                            }}
                            data={sortBySentiment(bars).slice(
                                bars.length - 5,
                                bars.length
                            )}
                            keys={Object.keys(ORDER).reverse()}
                            colors={Object.values(ORDER).reverse()}
                            indexBy="category"
                            margin={{
                                top: 10,
                                right: 50,
                                bottom: 50,
                                left: 250,
                            }}
                            padding={0.3}
                            minValue={0}
                            maxValue={100}
                            layout="horizontal"
                            valueScale={{type: "linear"}}
                            indexScale={{type: "band", round: true}}
                            defs={[
                                {
                                    id: "dots",
                                    type: "patternDots",
                                    background: "inherit",
                                    color: "#38bcb2",
                                    size: 4,
                                    padding: 1,
                                    stagger: true,
                                },
                                {
                                    id: "lines",
                                    type: "patternLines",
                                    background: "inherit",
                                    color: "#eed312",
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10,
                                },
                            ]}
                            // fill={[
                            //     {
                            //         match: {
                            //             id: "Frustrated",
                            //         },
                            //         id: "dots",
                            //     },
                            //     {
                            //         match: {
                            //             id: "Neutral",
                            //         },
                            //         id: "lines",
                            //     },
                            // ]}
                            borderColor={{
                                from: "color",
                                modifiers: [["darker", 1.6]],
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Percentage",
                                legendPosition: "middle",
                                legendOffset: 32,
                                truncateTickAt: 0,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "",
                                legendPosition: "middle",
                                legendOffset: -40,
                                truncateTickAt: 0,
                            }}
                            enableGridX={true}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: "color",
                                modifiers: [["darker", 1.6]],
                            }}
                            legends={[]}
                            role="application"
                            ariaLabel="Sentiment Categorisation"
                            barAriaLabel={(e) =>
                                e.id +
                                ": " +
                                e.formattedValue +
                                " for Subcategory: " +
                                e.indexValue
                            }
                        />
                    </Box>
                )}
                <Button
                    variant="outlined"
                    onClick={() => setViewAll(!viewAll)}
                    sx={{alignSelf: "flex-end", mt: 2}}
                >
                    {viewAll ? "View Less" : "View All"}
                </Button>
            </Paper>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                width: "100%",
                flexDirection: "column",
            }}
        >
            <DialogSentimentCategoriesGraph />
            <ButtonBase
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
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#151515" : "#ffffff",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#1a1a1a"
                                : "#f9f9f9",
                        transform: "scaleX(1.01) scaleY(1.02)",
                    },
                }}
                id="overall-sentimentcategoriesgraph"
                onClick={() => setSelectedMenu!("analytics")}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "stretch",
                        gap: 2,
                        mt: 1,
                        mb: 1,
                    }}
                >
                    <Box sx={{width: "50%"}}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold" }}
                        >
                            Top 5 Positive Categories
                        </Typography>
                        {bars.length === 0 ? (
                            <Typography variant="body2" color="grey">
                                No data
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 2,
                                    height: 200,
                                }}
                            >
                                <ResponsiveBar
                                    data={sortBySentiment(bars).slice(
                                        bars.length - 5,
                                        bars.length
                                    )}
                                    keys={Object.keys(ORDER).reverse()}
                                    colors={Object.values(ORDER).reverse()}
                                    indexBy="category"
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        bottom: 50,
                                        left: 240,
                                    }}
                                    padding={0.3}
                                    minValue={0}
                                    maxValue={100}
                                    layout="horizontal"
                                    valueScale={{type: "linear"}}
                                    indexScale={{type: "band", round: true}}
                                    defs={[
                                        {
                                            id: "dots",
                                            type: "patternDots",
                                            background: "inherit",
                                            color: "#38bcb2",
                                            size: 4,
                                            padding: 1,
                                            stagger: true,
                                        },
                                        {
                                            id: "lines",
                                            type: "patternLines",
                                            background: "inherit",
                                            color: "#eed312",
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10,
                                        },
                                    ]}
                                    // fill={[
                                    //     {
                                    //         match: {
                                    //             id: "Frustrated",
                                    //         },
                                    //         id: "dots",
                                    //     },
                                    //     {
                                    //         match: {
                                    //             id: "Neutral",
                                    //         },
                                    //         id: "lines",
                                    //     },
                                    // ]}
                                    borderColor={{
                                        from: "color",
                                        modifiers: [["darker", 1.6]],
                                    }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: "Percentage",
                                        legendPosition: "middle",
                                        legendOffset: 32,
                                        truncateTickAt: 0,
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: "",
                                        legendPosition: "middle",
                                        legendOffset: -40,
                                        truncateTickAt: 0,
                                    }}
                                    enableGridX={true}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{
                                        from: "color",
                                        modifiers: [["darker", 1.6]],
                                    }}
                                    legends={[]}
                                    role="application"
                                    ariaLabel="Sentiment Categorisation"
                                    barAriaLabel={(e) =>
                                        e.id +
                                        ": " +
                                        e.formattedValue +
                                        " for Subcategory: " +
                                        e.indexValue
                                    }
                                />
                            </Box>
                        )}
                    </Box>
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{borderRightWidth: 2, borderColor: "black"}}
                    />
                    <Box sx={{width: "50%"}}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold" }}
                        >
                            Top 5 Negative Categories
                        </Typography>
                        {bars.length === 0 ? (
                            <Typography variant="body2" color="grey">
                                No data
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 2,
                                    height: 200,
                                }}
                            >
                                <ResponsiveBar
                                    data={sortBySentiment(bars, true).slice(
                                        bars.length - 5,
                                        bars.length
                                    )}
                                    keys={Object.keys(ORDER).reverse()}
                                    colors={Object.values(ORDER).reverse()}
                                    indexBy="category"
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        bottom: 50,
                                        left: 240,
                                    }}
                                    padding={0.3}
                                    minValue={0}
                                    maxValue={100}
                                    layout="horizontal"
                                    valueScale={{type: "linear"}}
                                    indexScale={{type: "band", round: true}}
                                    defs={[
                                        {
                                            id: "dots",
                                            type: "patternDots",
                                            background: "inherit",
                                            color: "#38bcb2",
                                            size: 4,
                                            padding: 1,
                                            stagger: true,
                                        },
                                        {
                                            id: "lines",
                                            type: "patternLines",
                                            background: "inherit",
                                            color: "#eed312",
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10,
                                        },
                                    ]}
                                    // fill={[
                                    //     {
                                    //         match: {
                                    //             id: "Frustrated",
                                    //         },
                                    //         id: "dots",
                                    //     },
                                    //     {
                                    //         match: {
                                    //             id: "Neutral",
                                    //         },
                                    //         id: "lines",
                                    //     },
                                    // ]}
                                    borderColor={{
                                        from: "color",
                                        modifiers: [["darker", 1.6]],
                                    }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: "Percentage",
                                        legendPosition: "middle",
                                        legendOffset: 32,
                                        truncateTickAt: 0,
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: "",
                                        legendPosition: "middle",
                                        legendOffset: -40,
                                        truncateTickAt: 0,
                                    }}
                                    enableGridX={true}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{
                                        from: "color",
                                        modifiers: [["darker", 1.6]],
                                    }}
                                    legends={[]}
                                    role="application"
                                    ariaLabel="Sentiment Categorisation"
                                    barAriaLabel={(e) =>
                                        e.id +
                                        ": " +
                                        e.formattedValue +
                                        " for Subcategory: " +
                                        e.indexValue
                                    }
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </ButtonBase>
        </Box>
    );
}
