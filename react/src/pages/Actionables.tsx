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
    Modal,
    Typography,
    TooltipProps,
    tooltipClasses,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import {useTheme} from "@mui/material/styles";
import useDetectScroll, {Direction} from "@smakss/react-scroll-direction";
import ActionsTracked from "../components/Dashboard/ActionsTracked";

const CustomWidthTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 180,
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
    const [enableGenerateActions, setEnableGenerateActions] =
        useState<boolean>(false);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [refresh, setRefresh] = useState(0);

    const [data, setData] = useState<Actionable[]>([]);

    const [dataNew, setDataNew] = useState<Actionable[]>([]);
    const [dataInProgress, setDataInProgress] = useState<Actionable[]>([]);
    const [dataDone, setDataDone] = useState<Actionable[]>([]);
    const [openCfmModal, setOpenCfmModal] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode[]>([]);
    const [loading, setLoading] = useState(false);

    const urlPrefix =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://jbaaam-yl5rojgcbq-et.a.run.app";

    useEffect(() => {
        setEnableGenerateActions(
            selectedProduct.length > 0 && selectedSource.length > 0
        );
    }, [selectedProduct, selectedSource]);

    const transformCategory = (category: string) => {
        // Insert spaces around / and &
        // Convert to title case
        return category
            .replace(/([/&])/g, " $1 ") // Insert spaces around / and &
            .replace(/\w\S*/g, function (txt) {
                // Convert to title case
                return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
            });
    };

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
            const newData = result
                .filter(
                    (item: Actionable) =>
                        item.status.toLowerCase() === "new".toLowerCase()
                )
                .map((item) => {
                    return {
                        ...item,
                        feedback_category: transformCategory(
                            item.feedback_category
                        ),
                    };
                });

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
            setOpenCfmModal(true);
        } else {
            setModalContent([
                <Typography key="Modal-content">
                    Are you sure? This will replace all current <b>Generated</b>{" "}
                    Actions.
                </Typography>,
                <Box sx={{display: "flex", justifyContent: "flex-end", mt: 2}}>
                    <Button onClick={() => setOpenCfmModal(false)}>No</Button>
                    <Button
                        onClick={() => {
                            inference();
                            setOpenCfmModal(false);
                        }}
                        color="primary"
                        sx={{ml: 2}}
                    >
                        Yes
                    </Button>
                </Box>,
            ]);
            setOpenCfmModal(true);
        }
    };

    const inference = () => {
        setLoading(true);
        fetch(
            //ENDPOINT
            // urlPrefix/controller_name/function(only if custom)?parameters&parameters
            `${urlPrefix}/actionables/inference?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("response inference", data);
                setRefresh(Math.random());
                setLoading(false);
                if (
                    data.message === "No data available to process actionables"
                ) {
                    setModalContent([
                        <Typography
                            key="error"
                            variant="h6"
                            component="div"
                            sx={{fontWeight: "bold"}}
                        >
                            No data
                        </Typography>,
                        <Typography
                            key="message"
                            variant="body1"
                            component="div"
                        >
                            There are no actionables to be generated from this
                            data.
                        </Typography>,
                    ]);
                    setOpenCfmModal(true);
                }
                return data;
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    };

    return (
        <Box sx={{maxWidth: "lg", mx: "auto", px: 2}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Actionables</h1>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: enableGenerateActions
                            ? "#e80000"
                            : "#d3d3d3",
                        boxShadow: 0,
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: 2,
                        border: enableGenerateActions
                            ? 0
                            : "1px solid rgba(0, 0, 0, 0.12)",
                        "&:hover": {
                            backgroundColor: "#b80000",
                            boxShadow: 0,
                        },
                    }}
                    onClick={handleGenerateActionsClick}
                    disabled={!enableGenerateActions}
                >
                    Generate Actions
                </Button>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                    Processing...
                </Backdrop>
            </Box>
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
                    backgroundColor:
                        scrollPosition.top > 0
                            ? theme.palette.mode === "dark"
                                ? "#000"
                                : "#E9E9EB"
                            : null,
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
                <Modal
                    open={openCfmModal}
                    onClose={() => setOpenCfmModal(false)}
                    aria-labelledby="modal-content"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            p: 2.5,
                            bgcolor: "background.paper",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            position: "absolute",
                            borderRadius: 3,
                            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Typography
                            id="modal-title"
                            variant="h6"
                            component="h2"
                        >
                            {modalContent}
                        </Typography>
                    </Box>
                </Modal>
            </Box>
            <ActionsTracked isDashboard={false} />
            <Box sx={{flexGrow: 1}}>
                <Tooltip
                    title={
                        <span>
                            <b>To Fix</b>: Feedback highlighting{" "}
                            <u>frequent complaints or persistent issues</u> that
                            require maintenance or repair.
                            <br />
                            <br />
                            <b>To Keep in Mind</b>: Feedback with{" "}
                            <u>mixed reviews</u>, containing both positive and
                            negative comments, suggesting areas that require
                            ongoing attention.
                            <br />
                            <br />
                            <b>To Amplify</b>: Feedback that is generally
                            neutral to positive but highlights areas with{" "}
                            <u>potential for improvement</u>.
                            <br />
                            <br />
                            <b>To Promote</b>: Feedback with a high majority of
                            positive comments, indicating services or aspects
                            DBS <u>should continue promoting</u>.
                        </span>
                    }
                    placement="right-end"
                    arrow
                >
                    <Grid container spacing={2}>
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

                            {dataNew.length === 0 ? (
                                <Box sx={{width: "100%", height: "100%"}}>
                                    <Typography variant="body2" color="grey">
                                        No data
                                    </Typography>
                                </Box>
                            ) : (
                                <CustomWidthTooltip
                                    title={
                                        <span>
                                            New actionables are{" "}
                                            <b>always regenerated</b> here, move
                                            them to <b>IN PROGRESS</b> or{" "}
                                            <b>DONE</b>!
                                        </span>
                                    }
                                    arrow
                                    placement="left-start"
                                >
                                    <TodoList
                                        data={dataNew}
                                        setRefresh={setRefresh}
                                        forWidget="GENERATED-ACTIONS"
                                    />
                                </CustomWidthTooltip>
                            )}
                        </Grid>
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
                </Tooltip>
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
