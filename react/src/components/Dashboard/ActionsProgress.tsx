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
import {Actionable} from "../Actionables/Interfaces";
import {ResponsiveBar} from "@nivo/bar";

interface ActionsProgressProps {
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

type Bar = {
    category: string;
    inProgress: number;
    inProgressColor: string;
    done: number;
    doneColor: string;
};

type CustomRef<T> = {
    img: T;
    reportDesc?: string;
};

export default forwardRef(function ActionsProgress(
    {setSelectedMenu}: ActionsProgressProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
    const [actionsProgressPct, setActionsProgressPct] = useState<Bar>({
        category: "Actions",
        inProgress: 0,
        inProgressColor: "red",
        done: 0,
        doneColor: "green",
    });
    const [actionsProgressRaw, setActionsProgressRaw] = useState<
        Record<string, number>
    >({
        inProgress: 0,
        done: 0,
    });
    const theme = useTheme();

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(`${urlPrefix}/actionables.json`)
            .then((response) => response.json())
            .then((data: Actionable[]) => {
                const inProgressData = data.filter(
                    (item: Actionable) =>
                        item.status.toLowerCase() ===
                        "in progress".toLowerCase()
                );
                const doneData = data.filter(
                    (item: Actionable) =>
                        item.status.toLowerCase() === "done".toLowerCase()
                );
                const totalDataLen = inProgressData.length + doneData.length;
                setActionsProgressPct((prevState) => ({
                    ...prevState,
                    inProgress: parseFloat(
                        ((100 * inProgressData.length) / totalDataLen).toFixed(
                            1
                        )
                    ),
                    done: parseFloat(
                        ((100 * doneData.length) / totalDataLen).toFixed(1)
                    ),
                }));
                setActionsProgressRaw({
                    inProgress: inProgressData.length,
                    done: doneData.length,
                });
            });
    }, []);

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc: `The actionables progress is as shown.`,
        }),
        [actionsProgressPct]
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
            id="actions-progress"
            onClick={() => setSelectedMenu("actionables")}
        >
            <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                Actions Progress
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mt: 2,
                    height: 100,
                }}
            >
                <ResponsiveBar
                    data={[actionsProgressPct]}
                    keys={["inProgress", "done"]}
                    colors={[
                        actionsProgressPct["inProgressColor"],
                        actionsProgressPct["doneColor"],
                    ]}
                    indexBy="category"
                    margin={{
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10,
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
                    axisBottom={null}
                    axisLeft={null}
                    enableGridX={true}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="rgba(255, 255, 255, 0.9)"
                    legends={[]}
                    role="application"
                    ariaLabel="Actions Progress"
                    barAriaLabel={(e) =>
                        e.id +
                        ": " +
                        e.formattedValue +
                        " for Action: " +
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
                                        theme.palette.mode === "dark"
                                            ? "#CCC"
                                            : "#222",
                                },
                            },
                            ticks: {
                                line: {
                                    stroke:
                                        theme.palette.mode === "dark"
                                            ? "#999"
                                            : "#222",
                                },
                                text: {
                                    fill:
                                        theme.palette.mode === "dark"
                                            ? "#999"
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
                    tooltip={({id, color}) => (
                        <div
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#333"
                                        : "#fff",
                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
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
                                    {id}: <b>{actionsProgressRaw[id]}</b> items
                                </Typography>
                            </div>
                        </div>
                    )}
                />
            </Box>
        </ButtonBase>
    );
});
