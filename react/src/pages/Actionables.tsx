import React, {useState, useEffect} from "react";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Calendar from "../components/Calendar";
import TodoList from "../components/Actionables/TodoList";
import DialogAddAction from "../components/Actionables/DialogAddAction";
import useDebounce from "../components/Actionables/useDebounce";
import {
    ActionablesPageProps,
    Actionable,
} from "../components/Actionables/Interfaces";
import {
    Chip,
    Grid,
    Box,
    styled,
    Tooltip,
    IconButton,
    TooltipProps,
    tooltipClasses,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import {useTheme} from "@mui/material/styles";
import useDetectScroll, {Direction} from "@smakss/react-scroll-direction";

const CustomWidthTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 230,
    },
});

export default function Actionables({
    setFromDate,
    fromDate,
    setToDate,
    toDate,
    selectedProduct,
    setSelectedProduct,
    selectedSource,
    setSelectedSource,
}: ActionablesPageProps) {
    const {scrollDir, scrollPosition} = useDetectScroll();
    const theme = useTheme();
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");

    const combinedFilters = {
        fromDate_string,
        toDate_string,
        selectedProduct,
        selectedSource,
    };
    const debouncedCombinedFilters = useDebounce(combinedFilters, 5000); // 10000ms debounce delay
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [refresh, setRefresh] = useState(0);

    const [data, setData] = useState<Actionable[]>([]);

    const [dataNew, setDataNew] = useState<Actionable[]>([]);
    const [dataInProgress, setDataInProgress] = useState<Actionable[]>([]);
    const [dataDone, setDataDone] = useState<Actionable[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/actionables.json",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result: Actionable[] = await response.json();
            const newData = result.filter(
                (item: Actionable) =>
                    item.status.toLowerCase() === "new".toLowerCase()
            );
            setDataNew(newData);
            const inProgressData = result.filter(
                (item: Actionable) =>
                    item.status.toLowerCase() === "in progress".toLowerCase()
            );
            setDataInProgress(inProgressData);
            const doneData = result.filter(
                (item: Actionable) =>
                    item.status.toLowerCase() === "done".toLowerCase()
            );
            setDataDone(doneData);

            setData(result);
        } catch (error) {}
    };

    useEffect(() => {
        fetchData();
    }, [refresh]); // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        if (debouncedCombinedFilters) {
            const urlPrefix =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:3000"
                    : "https://jbaaam-yl5rojgcbq-et.a.run.app";
            fetch(
                //ENDPOINT
                // urlPrefix/controller_name/function(only if custom)?parameters&parameters
                `${urlPrefix}/actionables/inference?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            ).then((response) => {
                console.log("response inference", response);
                return response.json();
            });
        }
    }, [debouncedCombinedFilters]);

    return (
        <Box sx={{maxWidth: "lg", mx: "auto", px: 2}}>
            <h1>Actionables</h1>
            {/* Sticky, Freezes while scrolling */}
            <Box
                sx={{
                    position: "sticky",
                    top: 74,
                    display: "flex",
                    flexDirection: {xs: "column", sm: "row"},
                    gap: 2,
                    mb: 7,
                    // pb: 1,
                    // justifyContent: "flex-start",
                    justifyContent: "center",
                    alignItems: scrollPosition.top > 0 ? "center" : null,
                    zIndex: 1000, // Ensure it's above other content
                    backgroundColor: scrollPosition.top > 0 ? "white" : null,
                    borderRadius: 4,
                }}
            >
                <Box sx={{flexBasis: {xs: "100%", sm: "40%"}, flexGrow: 1}}>
                    <Calendar
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "30%"}, flexGrow: 1}}>
                    <FilterProduct
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        multiple={true}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "30%"}, flexGrow: 1}}>
                    <FilterSource
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                        multiple={true}
                    />
                </Box>
            </Box>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    <CustomWidthTooltip
                        title={
                            <span>
                                <b>NEW</b> actionables are always regenerated,
                                move them to <b>IN PROGRESS</b> or <b>DONE</b>!
                            </span>
                        }
                        arrow
                        placement="left-start"
                    >
                        <Grid item xs={4}>
                            <Chip
                                icon={<NewReleasesTwoToneIcon />}
                                label="NEW"
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    backgroundColor: "rgba(232, 0, 0, 0.2)",
                                    fontWeight: "bold",
                                    py: 2,
                                    px: 0.5,
                                    borderWidth: 2,
                                }}
                            />
                            <TodoList data={dataNew} setRefresh={setRefresh} />
                        </Grid>
                    </CustomWidthTooltip>
                    <Grid item xs={4}>
                        <Chip
                            icon={<RotateRightTwoToneIcon />}
                            label="IN PROGRESS"
                            variant="outlined"
                            sx={{
                                mb: 2,
                                color: "#DA5707",
                                borderColor: "#DA5707",
                                borderRadius: 3,
                                backgroundColor: "rgba(218, 87, 7, 0.2)",
                                fontWeight: "bold",
                                py: 2,
                                px: 0.5,
                                borderWidth: 2,
                                "& .MuiChip-icon": {
                                    color: "#DA5707",
                                },
                            }}
                        />
                        <TodoList
                            data={dataInProgress}
                            setRefresh={setRefresh}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Chip
                            icon={<CheckCircleTwoToneIcon />}
                            label="DONE"
                            variant="outlined"
                            sx={{
                                mb: 2,
                                color: "#208306",
                                borderColor: "#208306",
                                borderRadius: 3,
                                backgroundColor: "rgba(32, 131, 6, 0.2)",
                                fontWeight: "bold",
                                py: 2,
                                px: 0.5,
                                borderWidth: 2,
                                "& .MuiChip-icon": {
                                    color: "#208306",
                                },
                            }}
                        />
                        <TodoList data={dataDone} setRefresh={setRefresh} />
                    </Grid>
                </Grid>
            </Box>

            <DialogAddAction
                fromDate={fromDate}
                toDate={toDate}
                selectedProduct={selectedProduct}
                selectedSource={selectedSource}
                isDetailed={true}
                setRefresh={setRefresh}
            />
        </Box>
    );
}

export {};
