import React, {
  useEffect,
  useState,
  forwardRef,
  ForwardedRef,
  useRef,
  useImperativeHandle,
} from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Paper, Box, Typography, ButtonBase } from "@mui/material";
import { Dayjs } from "dayjs";
import { ResponsiveLine } from "@nivo/line";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

type CustomRef<T> = {
  img: T;
  reportDesc?: string;
};

interface SentimentScoreGraphProps {
  fromDate: Dayjs;
  toDate: Dayjs;
  selectedProduct: string[];
  selectedSource: string[];
  isDetailed: boolean;
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
}

export default forwardRef(function SentimentScoreGraph(
  {
    fromDate,
    toDate,
    selectedProduct,
    selectedSource,
    isDetailed,
    setSelectedMenu,
  }: SentimentScoreGraphProps,
  ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
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
  const [selectedFeedbackcategories, setSelectedFeedbackcategories] = useState<
    string[]
  >([]);
  const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
  const [graphFeedbackcategories, setGraphFeedbackcategories] = useState<
    string[]
  >([]);

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
    return Math.abs(hash) % 360;
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubcategory((prevValue) => (prevValue === value ? "" : value));
    setSelectedFeedbackcategories([]);
  };

  const handleFeedbackcategoryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedFeedbackcategories(
      typeof value === "string" ? value.split(",") : value
    );
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
      !selectedSubcategory ||
      selectedFeedbackcategories.length === 0
    ) {
      setGraphSubcategories([]);
      setGraphFeedbackcategories([]);
      setSentimentScores([]);
    }
    if (isDetailed) {
      fetch(
        `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
      )
        .then((response) => response.json())
        .then((data: Record<string, string>[]) => {
          if (data.length > 0) {
            setGraphSubcategories(
              Array.from(new Set(data.map(({ subcategory }) => subcategory)))
            );
            const filteredSubcategories = data.filter((item) => {
              if (item.subcategory)
                return item.subcategory.includes(selectedSubcategory);
            });
            setGraphFeedbackcategories(
              Array.from(
                new Set(
                  filteredSubcategories.map(
                    ({ feedback_category }) => feedback_category
                  )
                )
              )
            );
            const filteredData = filteredSubcategories.filter((item) => {
              if (item.feedback_category)
                return selectedFeedbackcategories.includes(
                  item.feedback_category
                );
            });
            const filteredDataGroupedByFeedbackcategory = filteredData.reduce(
              (acc, item) => {
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
              },
              {} as Record<string, Record<string, number[]>>
            );
            const avgDataGroupedByFeedbackcategory = Object.entries(
              filteredDataGroupedByFeedbackcategory
            ).reduce(
              (acc, [feedbackcategory, date_sentiment_scores]) => {
                acc[feedbackcategory] = Object.entries(
                  date_sentiment_scores
                ).map(([date, sentiment_scores]) => {
                  const totalScore = sentiment_scores.reduce(
                    (sum, sentiment_scores) => sum + sentiment_scores,
                    0
                  );
                  const averageScore = totalScore / sentiment_scores.length;
                  return {
                    date,
                    sentiment_score: averageScore,
                  };
                });
                return acc;
              },
              {} as Record<
                string,
                {
                  date: string;
                  sentiment_score: number;
                }[]
              >
            );

            setSentimentScores(
              Object.entries(avgDataGroupedByFeedbackcategory).map(
                ([feedback_category, date_sentiment_score]) => {
                  return {
                    id: feedback_category,
                    color: `hsl(${feedbackcategoryHashToHue(
                      feedback_category
                    )}, 70%, 50%)`,
                    data: date_sentiment_score
                      .sort((a, b) => convertDate(a.date) - convertDate(b.date))
                      .map(({ date, sentiment_score }) => ({
                        x: formatDate(date),
                        y: sentiment_score,
                      })),
                  };
                }
              )
            );
          } else {
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
            setSentimentScores([
              {
                id: "all",
                color: "hsl(8, 70%, 50%)",
                data: data
                  .sort((a, b) => convertDate(a.date) - convertDate(b.date))
                  .map(({ date, sentiment_score }) => ({
                    x: formatDate(date),
                    y: parseFloat(sentiment_score),
                  })),
              },
            ]);
          } else {
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
    selectedFeedbackcategories,
  ]);

  function findHighestAndLowestScores(dataSets: DataSet[]) {
    if (dataSets.length === 0) {
      return {
        highest: { score: null as number | null, dates: [] as string[] },
        lowest: { score: null as number | null, dates: [] as string[] },
      };
    }

    let highestScore = -Infinity;
    let lowestScore = Infinity;
    let highestDates: string[] = [];
    let lowestDates: string[] = [];

    dataSets.forEach((dataSet) => {
      dataSet.data.forEach(({ x, y }) => {
        if (y > highestScore) {
          highestScore = y;
          highestDates = [x];
        } else if (y === highestScore) {
          highestDates.push(x);
        }

        if (y < lowestScore) {
          lowestScore = y;
          lowestDates = [x];
        } else if (y === lowestScore) {
          lowestDates.push(x);
        }
      });
    });

    return {
      highest: { score: highestScore, dates: highestDates },
      lowest: { score: lowestScore, dates: lowestDates },
    };
  }
  const { highest, lowest } = findHighestAndLowestScores(sentimentScores);
  const internalRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(
    ref,
    () => {
      // Compute highest and lowest sentiment scores
      const allDataPoints = sentimentScores.flatMap((ds) => ds.data);
      const highest = allDataPoints.reduce(
        (max, dp) => (dp.y > max.y ? dp : max),
        allDataPoints[0]
      );
      const lowest = allDataPoints.reduce(
        (min, dp) => (dp.y < min.y ? dp : min),
        allDataPoints[0]
      );

      // Collect all dates for highest and lowest scores
      const highestDates = allDataPoints
        .filter((dp) => dp.y === highest.y)
        .map((dp) => dp.x);
      const lowestDates = allDataPoints
        .filter((dp) => dp.y === lowest.y)
        .map((dp) => dp.x);

      // Calculate total number of data points
      const totalDataPoints = sentimentScores.reduce(
        (acc, ds) => acc + ds.data.length,
        0
      );

      // Generate the report description
      return {
        img: internalRef.current!,
        reportDesc:
          totalDataPoints > 0
            ? `There are ${totalDataPoints} data points. The highest sentiment score was ${
                highest.y
              } on dates ${highestDates.join(
                ", "
              )}, and the lowest sentiment score was ${
                lowest.y
              } on dates ${lowestDates.join(", ")}.`
            : "No data.",
      };
    },
    [sentimentScores]
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
        id="detailed-sentimentscoregraph"
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%" }}>
            Sentiment Trend for
            {selectedSubcategory
              ? ` ${selectedSubcategory}`
              : " Selected Subcategories"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1, width: "80%" }}>
            <FormControl sx={{ m: 0, width: "50%" }}>
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
                  graphSubcategories.sort().map((subcategory: string) => (
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
            <FormControl
              sx={{ m: 0, width: "50%" }}
              disabled={!selectedSubcategory}
            >
              <InputLabel id="detailed-sentimentscoregraph-filter-feedbackcategory-label">
                Feedback Categories
              </InputLabel>
              <Select
                labelId="detailed-sentimentscoregraph-filter-feedbackcategory-label"
                id="detailed-sentimentscoregraph-filter-feedbackcategory"
                multiple
                value={selectedFeedbackcategories}
                onChange={handleFeedbackcategoryChange}
                input={
                  <OutlinedInput
                    id="detailed-sentimentscoregraph-select-feedbackcategory"
                    label="feedbackcategory"
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {graphFeedbackcategories
                  .sort()
                  .map((feedbackcategory: string) => (
                    <MenuItem key={feedbackcategory} value={feedbackcategory}>
                      {feedbackcategory}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        {sentimentScores.length === 0 ? (
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
              height: 300,
            }}
          >
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
              xFormat={`time: %d %b %y`}
              yScale={{
                type: "linear",
                min: 0,
                max: 5,
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
                tickValues: [0, 1, 2, 3, 4, 5],
              }}
              enableGridX={false}
              colors={{ scheme: "category10" }}
              pointSize={8}
              // theme: background / theme: grid.line.stroke / theme: labels.text.fill / "color" / "#..."
              pointColor={{ from: "color" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabel="data.yFormatted"
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
              // label styling
              tooltip={({ point }) => (
                <div
                  style={{
                    background: theme.palette.mode === "dark" ? "#333" : "#fff",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: point.serieColor,
                      borderRadius: "50%",
                      marginRight: 4,
                    }}
                  />
                  <div>
                    <div style={{ display: "flex" }}>
                      <strong>Date:&nbsp;</strong>
                      {point.data.xFormatted}
                    </div>
                    <div style={{ display: "flex" }}>
                      <strong>Score:&nbsp;</strong>
                      {point.data.yFormatted}
                    </div>
                  </div>
                </div>
              )}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 50,
                  itemsSpacing: 20,
                  itemDirection: "left-to-right",
                  itemWidth: 120,
                  itemHeight: 10,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
        )}
      </Paper>
    </Box>
  ) : (
    <Box
      ref={internalRef}
      sx={{
        display: "flex",
        gap: 2,
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
          borderRadius: 4,
          flex: 1,
          cursor: "pointer",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor:
            theme.palette.mode === "dark" ? "#151515" : "#ffffff",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#1a1a1a" : "#f9f9f9",
            transform: "scaleX(1.01) scaleY(1.02)",
          },
        }}
        id="overall-sentimentscoregraph"
        onClick={() => setSelectedMenu!("analytics")}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%" }}>
          Sentiment Trend for Selected Product(s)
        </Typography>
        <Typography
          color="grey"
          sx={{ fontWeight: "600", mb: 2, width: "100%" }}
        >
          across all subcategories
        </Typography>
        {sentimentScores.length === 0 ? (
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
              xFormat={`time: %d %b %y`}
              yScale={{
                type: "linear",
                min: 0,
                max: 5,
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
                tickValues: [0, 1, 2, 3, 4, 5],
              }}
              enableGridX={false}
              colors={{ scheme: "category10" }}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabel="data.yFormatted"
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
              // label styling
              tooltip={({ point }) => (
                <div
                  style={{
                    background: theme.palette.mode === "dark" ? "#333" : "#fff",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: point.serieColor,
                      borderRadius: "50%",
                      marginRight: 4,
                    }}
                  />
                  <div>
                    <div style={{ display: "flex" }}>
                      <strong>Date:&nbsp;</strong>
                      {point.data.xFormatted}
                    </div>
                    <div style={{ display: "flex" }}>
                      <strong>Score:&nbsp;</strong>
                      {point.data.yFormatted}
                    </div>
                  </div>
                </div>
              )}
            />
          </Box>
        )}
      </ButtonBase>
    </Box>
  );
});
