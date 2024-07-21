import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Paper, Box, Typography, ButtonBase, Divider} from "@mui/material";
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

    const [bars, setBars] = useState<Bar[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);

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
                a.Neutral,
                a.Satisfied,
                a.Excited,
            ];
            const bValues = [
                b.Frustrated,
                b.Unsatisfied,
                b.Neutral,
                b.Satisfied,
                b.Excited,
            ];

            if (negative) {
                for (let i = 0; i < aValues.length; i++) {
                    if (bValues[i] !== aValues[i]) {
                        return bValues[i] - aValues[i];
                    }
                }
            } else {
                // Highest to lowest no. of excited->satisfied->neutral->unsatisfied->frustrated
                for (let i = 0; i < aValues.length; i++) {
                    if (aValues[i] !== bValues[i]) {
                        return bValues[i] - aValues[i];
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
        setBars([
            {
                category: "Debit Card > Staff Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 50,
                UnsatisfiedColor: "orange",
                Neutral: 50,
                NeutralColor: "grey",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "Debit Card > Fee Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 14.285714285714286,
                UnsatisfiedColor: "orange",
                Neutral: 28.571428571428573,
                NeutralColor: "grey",
                Satisfied: 42.857142857142854,
                SatisfiedColor: "green",
                Excited: 14.285714285714286,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Debit Card > Application Related",
                Frustrated: 37.5,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 37.5,
                NeutralColor: "grey",
                Satisfied: 12.5,
                SatisfiedColor: "green",
                Excited: 12.5,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Credit Card > Fee Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 12.5,
                UnsatisfiedColor: "orange",
                Neutral: 12.5,
                NeutralColor: "grey",
                Satisfied: 50,
                SatisfiedColor: "green",
                Excited: 25,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Credit Card > Staff Related",
                Frustrated: 30,
                FrustratedColor: "red",
                Unsatisfied: 10,
                UnsatisfiedColor: "orange",
                Neutral: 20,
                NeutralColor: "grey",
                Satisfied: 10,
                SatisfiedColor: "green",
                Excited: 30,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Others > Staff Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 100,
                SatisfiedColor: "green",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "technical difficulties > Fee Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 100,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Credit Card > Application Related",
                Frustrated: 10,
                FrustratedColor: "red",
                Unsatisfied: 10,
                UnsatisfiedColor: "orange",
                Neutral: 30,
                NeutralColor: "grey",
                Satisfied: 20,
                SatisfiedColor: "green",
                Excited: 30,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Others > Fee Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 100,
                NeutralColor: "grey",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "Credit Card Application > Application Related",
                Frustrated: 12.5,
                FrustratedColor: "red",
                Unsatisfied: 25,
                UnsatisfiedColor: "orange",
                Neutral: 16.666666666666668,
                NeutralColor: "grey",
                Satisfied: 12.5,
                SatisfiedColor: "green",
                Excited: 33.333333333333336,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Credit Card Application > Staff Related",
                Frustrated: 23.529411764705884,
                FrustratedColor: "red",
                Unsatisfied: 11.764705882352942,
                UnsatisfiedColor: "orange",
                Neutral: 23.529411764705884,
                NeutralColor: "grey",
                Satisfied: 17.647058823529413,
                SatisfiedColor: "green",
                Excited: 23.529411764705884,
                ExcitedColor: "darkgreen",
            },
            {
                category: "Credit Card Application > Fee Related",
                Frustrated: 13.333333333333334,
                FrustratedColor: "red",
                Unsatisfied: 20,
                UnsatisfiedColor: "orange",
                Neutral: 20,
                NeutralColor: "grey",
                Satisfied: 20,
                SatisfiedColor: "green",
                Excited: 26.666666666666668,
                ExcitedColor: "darkgreen",
            },
            {
                category: "transaction issues > Fee Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 100,
                SatisfiedColor: "green",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "technical difficulties > Staff Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 100,
                NeutralColor: "grey",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "customer service issues > Application Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 100,
                ExcitedColor: "darkgreen",
            },
            {
                category: "card activation > Application Related",
                Frustrated: 100,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "technical difficulties > Application Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 100,
                UnsatisfiedColor: "orange",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "general inquiry > Application Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 100,
                NeutralColor: "grey",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "compliments > Application Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 0,
                NeutralColor: "red",
                Satisfied: 100,
                SatisfiedColor: "green",
                Excited: 0,
                ExcitedColor: "red",
            },
            {
                category: "transaction issues > Application Related",
                Frustrated: 0,
                FrustratedColor: "red",
                Unsatisfied: 0,
                UnsatisfiedColor: "red",
                Neutral: 100,
                NeutralColor: "grey",
                Satisfied: 0,
                SatisfiedColor: "red",
                Excited: 0,
                ExcitedColor: "red",
            },
        ]);
        // if (isDetailed) {
        //     if (!selectedSubcategory) setBars([]);
        //     fetch(
        //         `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        //     )
        //         .then((response) => response.json())
        //         .then((data: DataRecord[]) => {
        //             if (data.length > 0) {
        //                 setGraphSubcategories(
        //                     Array.from(
        //                         new Set(
        //                             data.map(({subcategory}) => subcategory)
        //                         )
        //                     )
        //                 );
        //                 const filteredSubcategories = data.filter((item) => {
        //                     if (item.subcategory)
        //                         return item.subcategory.includes(
        //                             selectedSubcategory
        //                         );
        //                 });
        //                 const dataGroupedByFeedbackcategory: Record<
        //                     string,
        //                     DataRecord[]
        //                 > = filteredSubcategories.reduce((acc, curr) => {
        //                     const key = `${curr.subcategory} > ${curr.feedback_category}`;
        //                     if (!acc[key]) {
        //                         acc[key] = [];
        //                     }
        //                     acc[key].push(curr);
        //                     return acc;
        //                 }, {} as Record<string, DataRecord[]>);

        //                 const barsData: Bar[] = Object.entries(
        //                     dataGroupedByFeedbackcategory
        //                 ).map(([key, records]) => {
        //                     const total = records.length;
        //                     const sentimentScores = records.map((r) =>
        //                         parseFloat(r.sentiment_score)
        //                     );
        //                     const frustratedRecords = sentimentScores.filter(
        //                         (score) => score <= 1
        //                     );
        //                     const unsatisfiedRecords = sentimentScores.filter(
        //                         (score) => score <= 2 && score > 1
        //                     );
        //                     const neutralRecords = sentimentScores.filter(
        //                         (score) => score <= 3 && score > 2
        //                     );
        //                     const satisfiedRecords = sentimentScores.filter(
        //                         (score) => score <= 4 && score > 3
        //                     );
        //                     const excitedRecords = sentimentScores.filter(
        //                         (score) => score > 4
        //                     );

        //                     const averageScore =
        //                         sentimentScores.reduce(
        //                             (sum, score) => sum + score,
        //                             0
        //                         ) / total;

        //                     return {
        //                         category: key,
        //                         Frustrated: parseFloat(
        //                             (
        //                                 (100 * frustratedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         FrustratedColor: getColorByOrder(
        //                             frustratedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / frustratedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Unsatisfied: parseFloat(
        //                             (
        //                                 (100 * unsatisfiedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         UnsatisfiedColor: getColorByOrder(
        //                             unsatisfiedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / unsatisfiedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Neutral: parseFloat(
        //                             (
        //                                 (100 * neutralRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         NeutralColor: getColorByOrder(
        //                             neutralRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / neutralRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Satisfied: parseFloat(
        //                             (
        //                                 (100 * satisfiedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         SatisfiedColor: getColorByOrder(
        //                             satisfiedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / satisfiedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Excited: parseFloat(
        //                             (
        //                                 (100 * excitedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         ExcitedColor: getColorByOrder(
        //                             excitedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / excitedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                     };
        //                 });
        //                 console.log(barsData);
        //                 setBars(barsData);
        //             } else {
        //                 setBars([]);
        //             }
        //         });
        // } else {
        //     fetch(
        //         `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        //     )
        //         .then((response) => response.json())
        //         .then((data: DataRecord[]) => {
        //             if (data.length > 0) {
        //                 // [
        //                 //     {
        //                 //         subcategory: "Card>Perks",
        //                 //         "very angry": -29,
        //                 //         "very angryColor": getColorByOrder(1.1, ORDER),
        //                 //         sad: -11,
        //                 //         sadColor: "hsl(130, 70%, 50%)",
        //                 //         others: 24,
        //                 //         othersColor: "hsl(222, 70%, 50%)",
        //                 //         satisfied: 28,
        //                 //         satisfiedColor: "hsl(125, 70%, 50%)",
        //                 //         happy: 8,
        //                 //         happyColor: "hsl(289, 70%, 50%)",
        //                 //     },
        //                 // ]
        //                 const dataGroupedByFeedbackcategory: Record<
        //                     string,
        //                     DataRecord[]
        //                 > = data.reduce((acc, curr) => {
        //                     const key = `${curr.subcategory} > ${curr.feedback_category}`;
        //                     if (!acc[key]) {
        //                         acc[key] = [];
        //                     }
        //                     acc[key].push(curr);
        //                     return acc;
        //                 }, {} as Record<string, DataRecord[]>);

        //                 const barsData: Bar[] = Object.entries(
        //                     dataGroupedByFeedbackcategory
        //                 ).map(([key, records]) => {
        //                     const total = records.length;
        //                     const sentimentScores = records.map((r) =>
        //                         parseFloat(r.sentiment_score)
        //                     );
        //                     const frustratedRecords = sentimentScores.filter(
        //                         (score) => score <= 1
        //                     );
        //                     const unsatisfiedRecords = sentimentScores.filter(
        //                         (score) => score <= 2 && score > 1
        //                     );
        //                     const neutralRecords = sentimentScores.filter(
        //                         (score) => score <= 3 && score > 2
        //                     );
        //                     const satisfiedRecords = sentimentScores.filter(
        //                         (score) => score <= 4 && score > 3
        //                     );
        //                     const excitedRecords = sentimentScores.filter(
        //                         (score) => score > 4
        //                     );

        //                     const averageScore =
        //                         sentimentScores.reduce(
        //                             (sum, score) => sum + score,
        //                             0
        //                         ) / total;

        //                     return {
        //                         category: key,
        //                         Frustrated: parseFloat(
        //                             (
        //                                 (100 * frustratedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         FrustratedColor: getColorByOrder(
        //                             frustratedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / frustratedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Unsatisfied: parseFloat(
        //                             (
        //                                 (100 * unsatisfiedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         UnsatisfiedColor: getColorByOrder(
        //                             unsatisfiedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / unsatisfiedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Neutral: parseFloat(
        //                             (
        //                                 (100 * neutralRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         NeutralColor: getColorByOrder(
        //                             neutralRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / neutralRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Satisfied: parseFloat(
        //                             (
        //                                 (100 * satisfiedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         SatisfiedColor: getColorByOrder(
        //                             satisfiedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / satisfiedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                         Excited: parseFloat(
        //                             (
        //                                 (100 * excitedRecords.length) /
        //                                 total
        //                             ).toFixed(1)
        //                         ),
        //                         ExcitedColor: getColorByOrder(
        //                             excitedRecords.reduce(
        //                                 (sum, score) => sum + score,
        //                                 0
        //                             ) / excitedRecords.length || 0,
        //                             ORDER
        //                         ),
        //                     };
        //                 });
        //                 console.log(barsData);
        //                 setBars(barsData);
        //             } else {
        //                 setBars([]);
        //             }
        //         });
        // }
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
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{marginRight: 2, width: "50%"}}
                >
                    Sentiment Categorisation
                </Typography>
                <FormControl sx={{m: 0, width: "20%"}}>
                    <InputLabel id="detailed-sentimentcategoriesgraph-filter-subcategory-label">
                        Subcategories
                    </InputLabel>
                    <Select
                        labelId="detailed-sentimentcategoriesgraph-filter-subcategory-label"
                        id="detailed-sentimentcategoriesgraph-filter-subcategory"
                        multiple={false}
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        input={
                            <OutlinedInput
                                id="detailed-sentimentcategoriesgraph-select-subcategory"
                                label="subcategory"
                                sx={{
                                    borderRadius: 4,
                                }}
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
                            graphSubcategories.map((subcategory: string) => (
                                <MenuItem
                                    key={subcategory}
                                    value={subcategory}
                                    className="subcategory-option"
                                >
                                    {subcategory}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No data from selection</MenuItem>
                        )}
                    </Select>
                </FormControl>
                {/* {bars.length === 0 ? (
                    <Typography variant="body2" color="grey">
                        No data
                    </Typography>
                ) : */}
                ({" "}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                        width: "100%",
                        height: 200,
                    }}
                >
                    <ResponsiveBar
                        data={sortBySentiment(bars).slice(0, 5)}
                        keys={Object.keys(ORDER)}
                        colors={Object.values(ORDER)}
                        indexBy="category"
                        margin={{
                            top: 10,
                            right: 50,
                            bottom: 50,
                            left: 200,
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
                            legend: "Percent",
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
                ){/* } */}
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
            <DialogSentimentCategoriesGraph />;
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
                        mt: 2,
                    }}
                >
                    <Box sx={{width: "50%"}}>
                        <Typography
                            variant="h6"
                            component="h3"
                            sx={{marginRight: 2, width: "50%"}}
                        >
                            Top 5 Positive Categories
                        </Typography>
                        {/* {bars.length === 0 ? (
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
                                height: 200,
                            }}
                        >
                            <ResponsiveBar
                                data={sortBySentiment(bars).slice(0, 5)}
                                keys={Object.keys(ORDER)}
                                colors={Object.values(ORDER)}
                                indexBy="category"
                                margin={{
                                    top: 10,
                                    right: 50,
                                    bottom: 50,
                                    left: 200,
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
                                    legend: "Percent",
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
                    </Box>
                    ){/* } */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{borderRightWidth: 2, borderColor: "black"}}
                    />
                    <Box sx={{width: "50%"}}>
                        <Typography
                            variant="h6"
                            component="h3"
                            sx={{marginRight: 2, width: "50%"}}
                        >
                            Top 5 Negative Categories
                        </Typography>
                        {/* {bars.length === 0 ? (
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
                                height: 200,
                            }}
                        >
                            <ResponsiveBar
                                data={sortBySentiment(bars, true).slice(0, 5)}
                                keys={Object.keys(ORDER)}
                                colors={Object.values(ORDER)}
                                indexBy="category"
                                margin={{
                                    top: 10,
                                    right: 50,
                                    bottom: 50,
                                    left: 200,
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
                                    legend: "Percent",
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
                    </Box>
                    ){/* } */}
                </Box>
            </ButtonBase>
        </Box>
    );
}
