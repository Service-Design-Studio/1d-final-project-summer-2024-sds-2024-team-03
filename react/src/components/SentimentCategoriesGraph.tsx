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
    Divider,
    Button,
    Dialog,
    DialogProps,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent,
    Chip,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Dayjs} from "dayjs";
import {ResponsiveBar} from "@nivo/bar";

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
const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const ORDER: Record<string, string> = {
    Promoter: "green",
    Satisfied: "lightgreen",
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

type CustomRef<T> = {
    img: T;
    reportDesc?: string;
};

export default forwardRef(function SentimentCategoriesGraph(
    {
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        isDetailed,
        setSelectedMenu,
    }: SentimentCategoriesGraphProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
    const theme = useTheme();
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");

    type DataRecord = {
        sentiment_score: string;
        product: string;
        subcategory: string;
        feedback_category: string;
        date: string;
        feedback: string;
        source: string;
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
        Promoter: number;
        PromoterColor: string;
    };

    const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [bars, setBars] = useState<Bar[]>([]);
    const [sortPositive, setSortPositive] = useState<boolean>(true);
    const [viewAll, setViewAll] = useState(false);

    const [dataGroupedByFeedbackcategory, setDataGroupedByFeedbackcategory] =
        useState<Record<string, DataRecord[]>>({});
    const [selectedBarData, setSelectedBarData] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
    const descriptionElementRef = useRef<HTMLElement>(null);

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

    const handleBarClick = (bar: any) => {
        const key = bar.indexValue;
        const sentiment = bar.id;
        let records = dataGroupedByFeedbackcategory[key].filter(
            (record) =>
                getColorByOrder(parseFloat(record.sentiment_score), ORDER) ===
                ORDER[sentiment]
        );

        if (sentiment === "Frustrated" || sentiment === "Unsatisfied") {
            records = records.sort(
                (a, b) =>
                    parseFloat(a.sentiment_score) -
                    parseFloat(b.sentiment_score)
            );
        } else {
            records = records.sort(
                (a, b) =>
                    parseFloat(b.sentiment_score) -
                    parseFloat(a.sentiment_score)
            );
        }

        setSelectedBarData(records);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

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
                a.Promoter,
            ];
            const bValues = [
                b.Frustrated,
                b.Unsatisfied,
                b.Satisfied,
                b.Promoter,
            ];

            if (negative) {
                for (let i = 0; i < 2; i++) {
                    // Only consider Frustrated then Unsatisfied
                    if (aValues[i] !== bValues[i]) {
                        return aValues[i] - bValues[i];
                    }
                }
                for (let i = 3; i > 1; i--) {
                    // If still not returned, consider the less of Satisfied then Promoter
                    if (aValues[i] !== bValues[i]) {
                        return bValues[i] - aValues[i];
                    }
                }
            } else {
                for (let i = 3; i > 1; i--) {
                    // For highest to lowest positive, only consider Satisfied then Promoter
                    if (aValues[i] !== bValues[i]) {
                        return aValues[i] - bValues[i];
                    }
                }
                for (let i = 0; i < 2; i++) {
                    // If still not returned, consider the less of Frustrated then Unsatisfied
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
        if (
            !fromDate ||
            !toDate ||
            selectedProduct.length === 0 ||
            selectedSource.length === 0 ||
            !selectedSubcategory
        ) {
            setGraphSubcategories([]);
            setBars([]);
        }
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
                                return selectedSubcategory === item.subcategory;
                        });
                        const dataGroupedByFeedbackcategory =
                            filteredSubcategories.reduce(
                                (
                                    acc,
                                    {
                                        subcategory,
                                        feedback_category,
                                        sentiment_score,
                                        date,
                                        product,
                                        feedback,
                                        source,
                                    }
                                ) => {
                                    const key = feedback_category;
                                    (acc[key] = acc[key] || []).push({
                                        subcategory,
                                        feedback_category,
                                        sentiment_score,
                                        date,
                                        product,
                                        feedback,
                                        source,
                                    });
                                    return acc;
                                },
                                {} as Record<string, DataRecord[]>
                            );

                        const barsDataFuncs = (
                            records: DataRecord[],
                            total: number
                        ) => {
                            const sentimentScores = records.map((record) =>
                                parseFloat(record.sentiment_score)
                            );
                            const average = (arr: number[]) =>
                                arr.reduce((sum, score) => sum + score, 0) /
                                    arr.length || 0;
                            return {
                                percentage: (count: number) =>
                                    parseFloat(
                                        ((100 * count) / total).toFixed(1)
                                    ),
                                averageScore: average(sentimentScores),
                                colors: {
                                    Frustrated: getColorByOrder(
                                        average(
                                            sentimentScores.filter(
                                                (score) => score <= 1
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Unsatisfied: getColorByOrder(
                                        average(
                                            sentimentScores.filter(
                                                (score) =>
                                                    score > 1 && score <= 2
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Neutral: getColorByOrder(
                                        average(
                                            sentimentScores.filter(
                                                (score) =>
                                                    score > 2 && score <= 3
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Satisfied: getColorByOrder(
                                        average(
                                            sentimentScores.filter(
                                                (score) =>
                                                    score > 3 && score <= 4
                                            )
                                        ),
                                        ORDER
                                    ),
                                    Promoter: getColorByOrder(
                                        average(
                                            sentimentScores.filter(
                                                (score) => score > 4
                                            )
                                        ),
                                        ORDER
                                    ),
                                },
                            };
                        };

                        const barsData: Bar[] = Object.entries(
                            dataGroupedByFeedbackcategory
                        ).map(([key, records]) => {
                            const sentimentScores = records.map((record) =>
                                parseFloat(record.sentiment_score)
                            );
                            const total = records.length;
                            const {percentage, colors} = barsDataFuncs(
                                records,
                                total
                            );

                            return {
                                category: key,
                                Frustrated: percentage(
                                    sentimentScores.filter(
                                        (score) => score <= 1
                                    ).length
                                ),
                                FrustratedColor: colors.Frustrated,
                                Unsatisfied: percentage(
                                    sentimentScores.filter(
                                        (score) => score > 1 && score <= 2
                                    ).length
                                ),
                                UnsatisfiedColor: colors.Unsatisfied,
                                Neutral: percentage(
                                    sentimentScores.filter(
                                        (score) => score > 2 && score <= 3
                                    ).length
                                ),
                                NeutralColor: colors.Neutral,
                                Satisfied: percentage(
                                    sentimentScores.filter(
                                        (score) => score > 3 && score <= 4
                                    ).length
                                ),
                                SatisfiedColor: colors.Satisfied,
                                Promoter: percentage(
                                    sentimentScores.filter((score) => score > 4)
                                        .length
                                ),
                                PromoterColor: colors.Promoter,
                            };
                        });
                        console.log(barsData);
                        setBars(barsData);
                        setDataGroupedByFeedbackcategory(
                            dataGroupedByFeedbackcategory
                        );
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
                                    Promoter: getColorByOrder(
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
                                Promoter: percentage(
                                    scores.filter((score) => score > 4).length
                                ),
                                PromoterColor: colors.Promoter,
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

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc:
                bars.length > 0
                    ? `${sortBySentiment(bars)
                          .slice(bars.length - 5, bars.length)
                          .map((bar) => {
                              return `${
                                  bar.Promoter > 0
                                      ? `${bar.Promoter}% were <b>Promoter</b> and `
                                      : ""
                              }${
                                  bar.Satisfied > 0
                                      ? `${bar.Satisfied}% were <b>Satisfied</b>`
                                      : ""
                              } about product <u>${
                                  bar.category.split(" > ")[0]
                              }</u> and subcategory <u>${
                                  bar.category.split(" > ")[1]
                              }</u>, demonstrating strong support.\n`;
                          })
                          .join(" ")}
                \n
                However, ${sortBySentiment(bars)
                    .slice(bars.length - 5, bars.length)
                    .map((bar) => {
                        return `${
                            bar.Frustrated > 0
                                ? `${bar.Frustrated}% were <b>Frustrated</b> and `
                                : ""
                        }${
                            bar.Unsatisfied > 0
                                ? `${bar.Unsatisfied}% were <b>Unsatisfied</b>`
                                : ""
                        } about product <u>${
                            bar.category.split(" > ")[0]
                        }</u> and subcategory <u>${
                            bar.category.split(" > ")[1]
                        }</u>, suggesting areas for improvement.\n`;
                    })
                    .join(" ")}`
                    : "No data.",
        }),
        [bars]
    );

    /* Must have parent container with a defined size */
    return isDetailed ? (
        <Box
            ref={internalRef}
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
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                flexGrow: 1,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{fontWeight: "bold", mr: 1}}
                            >
                                Sentiment Categorisation
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{fontWeight: "bold"}}
                                style={{
                                    color: sortPositive ? "darkgreen" : "red",
                                }}
                            >
                                {sortPositive ? "(Positive)" : "(Negative)"}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => setSortPositive(!sortPositive)}
                            sx={{
                                marginRight: 2,
                                borderRadius: 2,
                                border: 0,
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#555"
                                        : "#888",
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": {
                                    border: 0,
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "#777"
                                            : "#AAA",
                                },
                            }}
                        >
                            Sort
                        </Button>
                    </Box>
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
                                graphSubcategories.sort().map((subcategory) => (
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
                            height: 200,
                        }}
                    >
                        <React.Fragment>
                            <ResponsiveBar
                                onClick={handleBarClick}
                                data={
                                    viewAll && sortPositive
                                        ? sortBySentiment(bars)
                                        : sortPositive
                                        ? sortBySentiment(bars).slice(
                                              bars.length - 5,
                                              bars.length
                                          )
                                        : viewAll
                                        ? sortBySentiment(bars, true)
                                        : sortBySentiment(bars, true).slice(
                                              bars.length - 5,
                                              bars.length
                                          )
                                }
                                keys={
                                    sortPositive
                                        ? Object.keys(ORDER)
                                        : Object.keys(ORDER).reverse()
                                }
                                colors={
                                    sortPositive
                                        ? Object.values(ORDER)
                                        : Object.values(ORDER).reverse()
                                }
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
                                tooltip={({id, indexValue, value, color}) => (
                                    <div
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: "10px",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "#333"
                                                    : "#fff",
                                            boxShadow:
                                                "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                            color:
                                                theme.palette.mode === "dark"
                                                    ? "#fff"
                                                    : "#000",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    backgroundColor: color,
                                                    marginRight: "8px",
                                                }}
                                            ></div>
                                            <span>
                                                {id} - {indexValue}:{" "}
                                                <strong>{value}</strong>
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                color: "grey",
                                                fontStyle: "italic",
                                                marginTop: "5px",
                                            }}
                                        >
                                            <strong>Click</strong> to view
                                            related data
                                        </div>
                                    </div>
                                )}
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
                                    legendOffset: 40,
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
                                // background / grid.line.stroke / labels.text.fill / "color" / "#..."
                                labelTextColor="rgba(255, 255, 255, 0.9)"
                                legends={[]}
                                role="application"
                                ariaLabel="Sentiment Categorisation"
                                theme={{
                                    labels: {
                                        text: {
                                            fontWeight: "bold",
                                        },
                                    },
                                    axis: {
                                        legend: {
                                            text: {
                                                fontWeight: "bold",
                                                fill:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#ccc"
                                                        : "#222",
                                            },
                                        },
                                        ticks: {
                                            line: {
                                                stroke:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#ccc"
                                                        : "#222",
                                            },
                                            text: {
                                                fill:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#ccc"
                                                        : "#222",
                                            },
                                        },
                                    },
                                    grid: {
                                        line: {
                                            stroke:
                                                theme.palette.mode === "dark"
                                                    ? "#555"
                                                    : "#CCC",
                                        },
                                    },
                                }}
                                barAriaLabel={(e) =>
                                    e.id +
                                    ": " +
                                    e.formattedValue +
                                    " for Subcategory: " +
                                    e.indexValue
                                }
                            />
                            <Dialog
                                PaperProps={{style: {borderRadius: 18}}}
                                open={open}
                                onClose={handleClose}
                                scroll={scroll}
                                maxWidth="lg"
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                            >
                                <DialogTitle
                                    id="scroll-dialog-title"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Relevant data
                                    <Button
                                        onClick={handleClose}
                                        sx={{borderRadius: 4}}
                                    >
                                        <CloseIcon />
                                    </Button>
                                </DialogTitle>
                                <DialogContent dividers={scroll === "paper"}>
                                    <DialogContentText
                                        id="scroll-dialog-description"
                                        ref={descriptionElementRef}
                                        tabIndex={-1}
                                    >
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                borderRadius: 4,
                                                mt: 1,
                                                mb: 1,
                                                boxShadow:
                                                    "0px 0px 20px rgba(0, 0, 0, 0.2)",
                                            }}
                                        >
                                            <Table
                                                sx={{minWidth: 700}}
                                                aria-label="customized table"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>
                                                            Date
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Feedback
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Source
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Product
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Subcategory
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Feedback Category
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Sentiment Score
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedBarData.map(
                                                        (row, index) => (
                                                            <StyledTableRow
                                                                key={index}
                                                            >
                                                                <StyledTableCell>
                                                                    {row.date}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {
                                                                        row.feedback
                                                                    }
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {row.source}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {
                                                                        row.product
                                                                    }
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {
                                                                        row.subcategory
                                                                    }
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {
                                                                        row.feedback_category
                                                                    }
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {parseFloat(
                                                                        row.sentiment_score
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </DialogContentText>
                                </DialogContent>
                            </Dialog>
                        </React.Fragment>
                    </Box>
                )}
                <Button
                    variant="outlined"
                    onClick={() => setViewAll(!viewAll)}
                    sx={{
                        alignSelf: "flex-end",
                        mt: 2,
                        borderRadius: 2,
                        border: 0,
                        backgroundColor:
                            theme.palette.mode === "dark" ? "#555" : "#888",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": {
                            border: 0,
                            backgroundColor:
                                theme.palette.mode === "dark" ? "#777" : "#AAA",
                        },
                    }}
                >
                    {viewAll ? "View Less" : "View All"}
                </Button>
            </Paper>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
            }}
        >
            <ButtonBase
                ref={internalRef}
                component={Paper}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
                        transform: "scaleX(1.01) scaleY(1.01)",
                    },
                }}
                id="overall-sentimentcategoriesgraph"
                onClick={() => setSelectedMenu!("analytics")}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        alignItems: "stretch",
                        gap: 2,
                    }}
                >
                    <Box sx={{width: "100%"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold"}}>
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
                                    height: 320,
                                }}
                            >
                                <ResponsiveBar
                                    data={sortBySentiment(bars).slice(
                                        bars.length - 5,
                                        bars.length
                                    )}
                                    keys={Object.keys(ORDER)}
                                    colors={Object.values(ORDER)}
                                    indexBy="category"
                                    margin={{
                                        top: 10,
                                        right: 10,
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
                                        legendOffset: 40,
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
                                    labelTextColor="rgba(255, 255, 255, 0.9)"
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
                                    theme={{
                                        labels: {
                                            text: {
                                                fontWeight: "bold",
                                            },
                                        },
                                        axis: {
                                            legend: {
                                                text: {
                                                    fontWeight: "bold",
                                                    fill:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#CCC"
                                                            : "#222",
                                                },
                                            },
                                            ticks: {
                                                line: {
                                                    stroke:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#999"
                                                            : "#222",
                                                },
                                                text: {
                                                    fill:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#999"
                                                            : "#222",
                                                },
                                            },
                                        },
                                        grid: {
                                            line: {
                                                stroke:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#555"
                                                        : "#CCC",
                                            },
                                        },
                                    }}
                                    tooltip={({
                                        id,
                                        indexValue,
                                        value,
                                        color,
                                    }) => (
                                        <div
                                            style={{
                                                padding: "9px 12px",
                                                borderRadius: "10px",
                                                backgroundColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#333"
                                                        : "#fff",
                                                boxShadow:
                                                    "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#fff"
                                                        : "#000",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        backgroundColor: color,
                                                        marginRight: "8px",
                                                    }}
                                                ></div>
                                                <Typography variant="body2">
                                                    {id} — {indexValue}:{" "}
                                                    <b>{value}%</b>
                                                </Typography>
                                            </div>
                                        </div>
                                    )}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            borderBottom: `2px solid ${
                                theme.palette.mode === "dark" ? "#444" : "#ccc"
                            }`,
                        }}
                    />
                    <Box sx={{width: "100%"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold"}}>
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
                                    height: 320,
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
                                        legendOffset: 40,
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
                                    labelTextColor="rgba(255, 255, 255, 0.9)"
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
                                    theme={{
                                        labels: {
                                            text: {
                                                fontWeight: "bold",
                                            },
                                        },
                                        axis: {
                                            legend: {
                                                text: {
                                                    fontWeight: "bold",
                                                    fill:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#CCC"
                                                            : "#222",
                                                },
                                            },
                                            ticks: {
                                                line: {
                                                    stroke:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#999"
                                                            : "#222",
                                                },
                                                text: {
                                                    fill:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#999"
                                                            : "#222",
                                                },
                                            },
                                        },
                                        grid: {
                                            line: {
                                                stroke:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#555"
                                                        : "#CCC",
                                            },
                                        },
                                    }}
                                    tooltip={({
                                        id,
                                        indexValue,
                                        value,
                                        color,
                                    }) => (
                                        <div
                                            style={{
                                                padding: "9px 12px",
                                                borderRadius: "10px",
                                                backgroundColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#333"
                                                        : "#fff",
                                                boxShadow:
                                                    "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "#fff"
                                                        : "#000",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        backgroundColor: color,
                                                        marginRight: "8px",
                                                    }}
                                                ></div>
                                                <Typography variant="body2">
                                                    {id} — {indexValue}:{" "}
                                                    <b>{value}%</b>
                                                </Typography>
                                            </div>
                                        </div>
                                    )}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </ButtonBase>
        </Box>
    );
});
