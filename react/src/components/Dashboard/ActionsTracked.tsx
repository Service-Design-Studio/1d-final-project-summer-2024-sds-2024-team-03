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
    Typography,
    Box,
    ButtonBase,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    styled,
} from "@mui/material";
import {Actionable} from "../Actionables/Interfaces";
import {ResponsiveBar} from "@nivo/bar";

const StyledTableCell = styled(TableCell)({
    borderBottom: "none",
});

interface ActionsTrackedProps {
    setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
    isDashboard?: boolean;
    refresh?: number;
}

type Bar = {
    category: string;
    "In Progress": number;
    "In Progress Color": string;
    Done: number;
    "Done Color": string;
};

type CustomRef<T> = {
    img: T;
    reportDesc?: string;
};

export default forwardRef(function ActionsTracked(
    {setSelectedMenu, isDashboard = true, refresh}: ActionsTrackedProps,
    ref: ForwardedRef<CustomRef<HTMLDivElement>>
) {
    const [actionsTrackedPct, setActionsTrackedPct] = useState<Bar>({
        category: "Actions",
        "In Progress": 0,
        "In Progress Color": "orange",
        Done: 0,
        "Done Color": "green",
    });
    const [actionsTrackedRaw, setActionsTrackedRaw] = useState<
        Record<string, number>
    >({
        "In Progress": 0,
        Done: 0,
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
                setActionsTrackedPct((prevState) => ({
                    ...prevState,
                    "In Progress": parseFloat(
                        ((100 * inProgressData.length) / totalDataLen).toFixed(
                            1
                        )
                    ),
                    Done: parseFloat(
                        ((100 * doneData.length) / totalDataLen).toFixed(1)
                    ),
                }));
                setActionsTrackedRaw({
                    "In Progress": inProgressData.length,
                    Done: doneData.length,
                });
            });
    }, [refresh]);

    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
        ref,
        () => ({
            img: internalRef.current!,
            reportDesc: `The progress on the actionables is as shown.`,
        }),
        [actionsTrackedPct]
    );

    return isDashboard && setSelectedMenu ? (
        <ButtonBase
            ref={internalRef}
            component={Paper}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 4,
                flex: 2,
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
            id="actions-Tracked"
            onClick={() => setSelectedMenu("actionables")}
        >
            <Box sx={{width: "100%", justifyContent: "flex-start"}}>
                <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                    Actionables Tracked
                </Typography>
                <TableContainer>
                    <Table aria-label="actions-Tracked-table">
                        <TableBody>
                            <TableRow>
                                {Object.keys(actionsTrackedRaw)
                                    .reverse()
                                    .map((key) => (
                                        <StyledTableCell
                                            key={key}
                                            align="center"
                                            sx={{
                                                paddingTop: "10px",
                                                paddingBottom: "0px",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: actionsTrackedPct[
                                                        `${key} Color` as keyof Bar
                                                    ],
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {key}
                                            </Typography>
                                        </StyledTableCell>
                                    ))}
                            </TableRow>
                            <TableRow>
                                {Object.entries(actionsTrackedRaw)
                                    .reverse()
                                    .map(([key, value], index) => (
                                        <StyledTableCell
                                            key={index}
                                            align="center"
                                            sx={{padding: "0px"}}
                                        >
                                            <Typography
                                                sx={{
                                                    color: actionsTrackedPct[
                                                        `${key} Color` as keyof Bar
                                                    ],
                                                    fontSize: "2.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {value}
                                            </Typography>
                                        </StyledTableCell>
                                    ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box
                sx={{
                    height: 40,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                {Object.values(actionsTrackedRaw).every(
                    (actionItem) => actionItem === 0
                ) ? (
                    <Typography variant="body2" color="grey">
                        No actions tracked
                    </Typography>
                ) : (
                    <ResponsiveBar
                        data={[actionsTrackedPct]}
                        keys={["Done", "In Progress"]}
                        colors={[
                            actionsTrackedPct["Done Color"],
                            actionsTrackedPct["In Progress Color"],
                        ]}
                        indexBy="category"
                        minValue={0}
                        maxValue={100}
                        layout="horizontal"
                        margin={{top: 0, right: 10, bottom: 5, left: 10}}
                        valueScale={{type: "linear"}}
                        indexScale={{type: "band", round: true}}
                        borderRadius={6}
                        innerPadding={2}
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
                        enableGridX={false}
                        enableLabel={false}
                        label={(d) => `${d.value}%`}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="rgba(255, 255, 255, 0.9)"
                        legends={[]}
                        role="application"
                        ariaLabel="Actions Tracked"
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
                        isInteractive={false}
                    />
                )}
            </Box>
        </ButtonBase>
    ) : (
        <div>
            <Box sx={{width: "100%", justifyContent: "flex-start"}}>
                <TableContainer>
                    <Table aria-label="actions-Tracked-table">
                        <TableBody>
                            <TableRow>
                                {Object.keys(actionsTrackedRaw)
                                    .reverse()
                                    .map((key) => (
                                        <StyledTableCell
                                            key={key}
                                            align="center"
                                            sx={{
                                                paddingTop: "10px",
                                                paddingBottom: "0px",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: actionsTrackedPct[
                                                        `${key} Color` as keyof Bar
                                                    ],
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {key}
                                            </Typography>
                                        </StyledTableCell>
                                    ))}
                            </TableRow>
                            <TableRow>
                                {Object.entries(actionsTrackedRaw)
                                    .reverse()
                                    .map(([key, value], index) => (
                                        <StyledTableCell
                                            key={index}
                                            align="center"
                                            sx={{padding: "0px"}}
                                        >
                                            <Typography
                                                sx={{
                                                    color: actionsTrackedPct[
                                                        `${key} Color` as keyof Bar
                                                    ],
                                                    fontSize: "2.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {value}
                                            </Typography>
                                        </StyledTableCell>
                                    ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box
                sx={{
                    height: 40,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                {Object.values(actionsTrackedRaw).every(
                    (actionItem) => actionItem === 0
                ) ? (
                    <Typography variant="body2" color="grey">
                        No actions tracked
                    </Typography>
                ) : (
                    <ResponsiveBar
                        data={[actionsTrackedPct]}
                        keys={["Done", "In Progress"]}
                        colors={[
                            actionsTrackedPct["Done Color"],
                            actionsTrackedPct["In Progress Color"],
                        ]}
                        indexBy="category"
                        minValue={0}
                        maxValue={100}
                        layout="horizontal"
                        margin={{top: 0, right: 10, bottom: 5, left: 10}}
                        valueScale={{type: "linear"}}
                        indexScale={{type: "band", round: true}}
                        borderRadius={6}
                        innerPadding={2}
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
                        enableGridX={false}
                        enableLabel={false}
                        label={(d) => `${d.value}%`}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="rgba(255, 255, 255, 0.9)"
                        legends={[]}
                        role="application"
                        ariaLabel="Actions Tracked"
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
                        isInteractive={false}
                    />
                )}
            </Box>
        </div>
    );
});
