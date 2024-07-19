import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Paper, Box, Typography, ButtonBase} from "@mui/material";
import {Dayjs} from "dayjs";
import {ResponsiveLine} from "@nivo/line";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface SentimentScoreGraphProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    isDetailed: boolean;
    setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
}

export default function SentimentScoreGraph({
    fromDate,
    toDate,
    selectedProduct,
    selectedSource,
    isDetailed,
    setSelectedMenu,
}: SentimentScoreGraphProps) {
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");
    type DataPoint = {
        // Coordinates mandated by nivo library, cannot change to Eg. date, score
        x: string;
        y: number;
    };

    type DataSet = {
        id: string;
        color: string;
        data: DataPoint[];
    };

    const [sentimentScores, setSentimentScores] = useState<DataSet[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [selectedFeedbackcategory, setSelectedFeedbackcategories] = useState<
        string[]
    >([]);
    const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
    const [graphFeedbackcategories, setGraphFeedbackcategories] = useState<
        string[]
    >([]);
    const [noData, setNoData] = useState<boolean>(true);

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

    const feedbackcategoryHashToHue = (feedbackcategory: string) => {
        let hash = 0;
        for (let i = 0; i < feedbackcategory.length; i++) {
            hash = feedbackcategory.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash % 360;
    };

    const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
        const {
            target: {value},
        } = event;
        setSelectedSubcategory((prevValue) =>
            prevValue === value ? "" : value
        );
    };

    const handleFeedbackcategoryChange = (
        event: SelectChangeEvent<string[]>
    ) => {
        const {
            target: {value},
        } = event;
        setSelectedFeedbackcategories(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        if (isDetailed) {
            fetch(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            )
                .then((response) => response.json())
                .then((data: Record<string, string>[]) => {
                    if (data.length > 0) {
                        setNoData(false);
                        setGraphSubcategories(
                            Array.from(
                                new Set(
                                    data.map(({subcategory}) => subcategory)
                                )
                            )
                        );
                        const filteredSubcategories = data.filter((item) =>
                            selectedSubcategory.includes(item.subcategory)
                        );
                        setGraphFeedbackcategories(
                            Array.from(
                                new Set(
                                    filteredSubcategories.map(
                                        ({feedback_category}) =>
                                            feedback_category
                                    )
                                )
                            )
                        );
                        const filteredData = filteredSubcategories.filter(
                            (item) =>
                                selectedFeedbackcategory.includes(
                                    item.feedback_category
                                )
                        );
                        const filteredDataGroupedByFeedbackcategory =
                            filteredData.reduce((acc, item) => {
                                if (!acc[item.feedback_category]) {
                                    acc[item.feedback_category] = {};
                                }
                                if (!acc[item.feedback_category][item.date]) {
                                    acc[item.feedback_category][item.date] = [];
                                }
                                acc[item.feedback_category][item.date].push(
                                    parseFloat(item.sentiment_score as string)
                                );
                                return acc;
                            }, {} as Record<string, Record<string, number[]>>);

                        const avgDataGroupedByFeedbackcategory = Object.entries(
                            filteredDataGroupedByFeedbackcategory
                        ).reduce(
                            (
                                acc,
                                [feedbackcategory, date_sentiment_scores]
                            ) => {
                                acc[feedbackcategory] = Object.entries(
                                    date_sentiment_scores
                                ).map(([date, sentiment_scores]) => {
                                    const totalScore = sentiment_scores.reduce(
                                        (sum, sentiment_scores) =>
                                            sum + sentiment_scores,
                                        0
                                    );
                                    const averageScore =
                                        totalScore / sentiment_scores.length;
                                    return {
                                        date,
                                        sentiment_score: averageScore,
                                    };
                                });
                                return acc;
                            },
                            {} as Record<
                                string,
                                {date: string; sentiment_score: number}[]
                            >
                        );

                        setSentimentScores(
                            Object.entries(
                                avgDataGroupedByFeedbackcategory
                            ).map(
                                ([feedback_category, date_sentiment_score]) => {
                                    return {
                                        id: feedback_category,
                                        color: `hsl(${feedbackcategoryHashToHue(
                                            feedback_category
                                        )}, 70%, 50%)`,
                                        data: date_sentiment_score
                                            .sort(
                                                (a, b) =>
                                                    convertDate(a.date) -
                                                    convertDate(b.date)
                                            )
                                            .map(({date, sentiment_score}) => ({
                                                x: formatDate(date),
                                                y: sentiment_score,
                                            })),
                                    };
                                }
                            )
                        );
                    } else {
                        setNoData(true);
                        setSentimentScores([]);
                    }
                });
        } else {
            fetch(
                `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            )
                .then((response) => response.json())
                .then((data: Record<string, string>[]) => {
                    if (data.length > 0) {
                        setNoData(false);
                        setSentimentScores([
                            {
                                id: "all",
                                color: "hsl(8, 70%, 50%)",
                                data: data
                                    .sort(
                                        (a, b) =>
                                            convertDate(a.date) -
                                            convertDate(b.date)
                                    )
                                    .map(({date, sentiment_score}) => ({
                                        x: formatDate(date),
                                        y: parseFloat(sentiment_score),
                                    })),
                            },
                        ]);
                    } else {
                        setNoData(true);
                        setSentimentScores([]);
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
                mt: 2,
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
                    borderRadius: 2,
                    flex: 1,
                }}
                id="overall-sentimentscoregraph"
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
                        Sentiment vs Time trend for
                        {selectedSubcategory
                            ? ` ${selectedSubcategory}`
                            : " selected Subcategories"}
                    </Typography>
                    <FormControl sx={{m: 0, width: "20%"}}>
                        <InputLabel id="detailed-sentimentscoregraph-filter-subcategory-label">
                            Subcategories
                        </InputLabel>
                        <Select
                            labelId="detailed-sentimentscoregraph-filter-subcategory-label"
                            id="detailed-sentimentscoregraph-filter-subcategory"
                            multiple={false}
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                            input={
                                <OutlinedInput
                                    id="detailed-sentimentscoregraph-select-subcategory"
                                    label="subcategory"
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
                            {graphSubcategories.map((subcategory: string) => (
                                <MenuItem key={subcategory} value={subcategory}>
                                    {subcategory}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        sx={{m: 0, width: "20%"}}
                        disabled={!selectedSubcategory}
                    >
                        <InputLabel id="detailed-sentimentscoregraph-filter-feedbackcategory-label">
                            Feedback Categories
                        </InputLabel>
                        <Select
                            labelId="detailed-sentimentscoregraph-filter-feedbackcategory-label"
                            id="detailed-sentimentscoregraph-filter-feedbackcategory"
                            multiple
                            value={selectedFeedbackcategory}
                            onChange={handleFeedbackcategoryChange}
                            input={
                                <OutlinedInput
                                    id="detailed-sentimentscoregraph-select-feedbackcategory"
                                    label="feedbackcategory"
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
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {graphFeedbackcategories.map(
                                (feedbackcategory: string) => (
                                    <MenuItem
                                        key={feedbackcategory}
                                        value={feedbackcategory}
                                    >
                                        {feedbackcategory}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Box>
                {noData ? (
                    <Typography variant="body2" color="grey">
                        No data
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            width: "100%",
                            height: 200,
                        }}
                    >
                        {sentimentScores.length > 0 && (
                            <ResponsiveLine
                                data={sentimentScores}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 80,
                                    left: 40,
                                }}
                                xScale={{
                                    type: "time",
                                    format: "%d %b %y",
                                    precision: "day",
                                }}
                                xFormat={`time:%d %b %y`}
                                yScale={{
                                    type: "linear",
                                    min: "auto",
                                    max: "auto",
                                    stacked: false,
                                    reverse: false,
                                }}
                                yFormat=" >+.1f"
                                curve="linear"
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "",
                                    legendOffset: 36,
                                    legendPosition: "middle",
                                    truncateTickAt: 0,
                                    format: "%b '%y",
                                    tickValues: "every 1 month",
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "",
                                    legendOffset: -40,
                                    legendPosition: "middle",
                                    truncateTickAt: 0,
                                }}
                                enableGridX={false}
                                colors={{scheme: "category10"}}
                                pointSize={8}
                                pointColor={{theme: "background"}}
                                pointBorderWidth={2}
                                pointBorderColor={{from: "serieColor"}}
                                pointLabel="data.yFormatted"
                                pointLabelYOffset={-12}
                                enableTouchCrosshair={true}
                                useMesh={true}
                                legends={[
                                    {
                                        anchor: "bottom",
                                        direction: "row",
                                        justify: false,
                                        translateX: 0,
                                        translateY: 50,
                                        itemsSpacing: 20,
                                        itemDirection: "left-to-right",
                                        itemWidth: 80,
                                        itemHeight: 10,
                                        itemOpacity: 0.75,
                                        symbolSize: 12,
                                        symbolShape: "circle",
                                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                                        effects: [
                                            {
                                                on: "hover",
                                                style: {
                                                    itemBackground:
                                                        "rgba(0, 0, 0, .03)",
                                                    itemOpacity: 1,
                                                },
                                            },
                                        ],
                                    },
                                ]}
                            />
                        )}
                    </Box>
                )}
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
                id="overall-sentimentscoregraph"
                onClick={() => setSelectedMenu!("analytics")}
            >
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{marginRight: 2, width: "50%"}}
                >
                    Sentiment vs Time trend for Product(s) (All Subcategories)
                </Typography>
                {noData ? (
                    <Typography variant="body2" color="grey">
                        No data
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            width: "100%",
                            height: 200,
                        }}
                    >
                        {sentimentScores.length > 0 && (
                            <ResponsiveLine
                                data={sentimentScores}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 40,
                                    left: 40,
                                }}
                                xScale={{
                                    type: "time",
                                    format: "%d %b %y",
                                    precision: "day",
                                }}
                                xFormat={`time:%d %b %y`}
                                yScale={{
                                    type: "linear",
                                    min: "auto",
                                    max: "auto",
                                    stacked: false,
                                    reverse: false,
                                }}
                                yFormat=" >+.1f"
                                curve="linear"
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "",
                                    legendOffset: 36,
                                    legendPosition: "middle",
                                    truncateTickAt: 0,
                                    format: "%b '%y",
                                    tickValues: "every 1 month",
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "",
                                    legendOffset: -40,
                                    legendPosition: "middle",
                                    truncateTickAt: 0,
                                }}
                                enableGridX={false}
                                colors={{scheme: "category10"}}
                                pointSize={8}
                                pointColor={{theme: "background"}}
                                pointBorderWidth={2}
                                pointBorderColor={{from: "serieColor"}}
                                pointLabel="data.yFormatted"
                                pointLabelYOffset={-12}
                                enableTouchCrosshair={true}
                                useMesh={true}
                            />
                        )}
                    </Box>
                )}
            </ButtonBase>
        </Box>
    );
}
