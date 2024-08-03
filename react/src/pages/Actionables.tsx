import React, {useState, useEffect} from "react";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import Calendar from "../components/Calendar";
import TodoList from "../components/Actionables/TodoList";
import DialogAddAction from "../components/Actionables/DialogAddAction";
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TooltipProps,
    tooltipClasses,
} from "@mui/material";
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

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [refresh, setRefresh] = useState(0);

    const [data, setData] = useState<Actionable[]>([]);

    const [dataNew, setDataNew] = useState<Actionable[]>([]);
    const [dataInProgress, setDataInProgress] = useState<Actionable[]>([]);
    const [dataDone, setDataDone] = useState<Actionable[]>([]);
    const [openCfmDialog, setOpenCfmDialog] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode[]>([]);
    const urlPrefix =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://jbaaam-yl5rojgcbq-et.a.run.app";

    const fetchData = async () => {
        try {
            const response = await fetch(`${urlPrefix}/actionables.json`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
    }, [refresh]);

    const handleGenerateActionsClick = () => {
        if (selectedProduct.length === 0 || selectedSource.length === 0) {
            setModalContent([
                <Typography
                    key="error"
                    variant="h6"
                    component="div"
                    sx={{fontWeight: "bold"}}
                >
                    Error
                </Typography>,
                <Typography key="message" variant="body1" component="div">
                    Please select product(s) and source(s).
                </Typography>,
            ]);
        } else {
            setModalContent([
                <DialogTitle key="dialog-title">Confirmation</DialogTitle>,
                <DialogContent key="dialog-content">
                    <Typography>
                        Are you sure? This will replace all current{" "}
                        <b>Generated</b> Actions.
                    </Typography>
                </DialogContent>,
                <DialogActions key="dialog-actions">
                    <Button onClick={() => setOpenCfmDialog(false)}>No</Button>
                    <Button
                        onClick={() => {
                            inference();
                            setOpenCfmDialog(false);
                        }}
                        color="primary"
                    >
                        Yes
                    </Button>
                </DialogActions>,
            ]);
            setOpenCfmDialog(true);
        }
    };

    const inference = () => {
        fetch(
            //ENDPOINT
            // urlPrefix/controller_name/function(only if custom)?parameters&parameters
            `${urlPrefix}/actionables/inference?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        ).then((response) => {
            console.log("response inference", response.json());
            setRefresh(Math.random());
            return response.json();
        });
    };

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
                <Box sx={{flexBasis: {xs: "100%", sm: "75%"}, flexGrow: 1}}>
                    <Calendar
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "40%"}, flexGrow: 1}}>
                    <FilterProduct
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        multiple={true}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "40%"}, flexGrow: 1}}>
                    <FilterSource
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                        multiple={true}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "30%"}, flexGrow: 1}}>
                    <Button
                        variant="contained"
                        onClick={handleGenerateActionsClick}
                    >
                        Generate Actions
                    </Button>
                </Box>
                <Dialog
                    open={openCfmDialog}
                    onClose={() => setOpenCfmDialog(false)}
                >
                    {modalContent}
                </Dialog>
            </Box>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    <CustomWidthTooltip
                        title={
                            <span>
                                New actionables are <b>always regenerated</b>{" "}
                                here, move them to <b>IN PROGRESS</b> or{" "}
                                <b>DONE</b>!
                            </span>
                        }
                        arrow
                        placement="left-start"
                    >
                        <Grid item xs={4}>
                            <Chip
                                icon={<NewReleasesTwoToneIcon />}
                                label="GENERATED ACTIONS"
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
                            <TodoList
                                data={dataNew}
                                setRefresh={setRefresh}
                                forWidget="GENERATED-ACTIONS"
                            />
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
                            forWidget="IN-PROGRESS"
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
                        <TodoList
                            data={dataDone}
                            setRefresh={setRefresh}
                            forWidget="DONE"
                        />
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
