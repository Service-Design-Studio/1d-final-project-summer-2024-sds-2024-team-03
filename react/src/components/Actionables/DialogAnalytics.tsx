import React, {useState, useEffect, useRef} from "react";
import {
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
    styled,
    Paper,
} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {ActionableWithRefresh} from "./Interfaces";
import TodoCard from "./TodoCard";

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

export default function ScrollDialog({
    actionable,
    setRefresh,
    forWidget,
}: ActionableWithRefresh) {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");

    const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
        console.log("=> handleClickOpen START open: ", open);
        setOpen(true);
        //setScroll(scrollType);
        console.log("=> handleClickOpen END open: ", open);
    };

    const handleClose = () => {
        console.log("=> handleClose open: ", open);
        setOpen(false);
    };

    const descriptionElementRef = useRef<HTMLElement>(null);
    useEffect(() => {
        console.log("useEffect open: ", open);
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    let feedbackData: Array<string> | null = null;

    try {
        const parsedData = JSON.parse(actionable.feedback_json);
        // console.log("feedbackJson", parsedData);
        if (
            Array.isArray(parsedData) &&
            parsedData.length === 1 &&
            parsedData[0] === null
        ) {
            feedbackData = null;
        } else {
            feedbackData = parsedData;
        }
    } catch {
        feedbackData = null;
    }

    return (
        <React.Fragment>
            <Button
                onClick={handleClickOpen("paper")}
                size="small"
                variant="contained"
                color="secondary"
                sx={{
                    fontWeight: "bold",
                    boxShadow: 0,
                    "&:hover": {
                        boxShadow: 0,
                    },
                }}
            >
                View Data
            </Button>
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
                    <Button onClick={handleClose} sx={{borderRadius: 4}}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent dividers={scroll === "paper"}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{flexBasis: "30%", flexShrink: 0}}>
                            <TodoCard
                                key={actionable.id}
                                actionable={actionable}
                                setRefresh={setRefresh}
                                forWidget={`${forWidget}-${actionable.actionable_category}-view_data`}
                                viewData={true}
                            />
                        </div>
                        <div
                            style={{
                                flexBasis: "70%",
                                flexGrow: 1,
                                overflowY: "auto",
                                height: "calc(100vh - 200px)",
                            }}
                        >
                            <TableContainer
                                component={Paper}
                                sx={{
                                    borderRadius: 4,
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
                                            <StyledTableCell align="left">
                                                Feedback
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {feedbackData &&
                                            feedbackData.map((feedback, i) => (
                                                <StyledTableRow key={i}>
                                                    <StyledTableCell align="left">
                                                        `$
                                                        {feedback.includes(": ")
                                                            ? feedback
                                                                  .split(
                                                                      ": "
                                                                  )[1]
                                                                  .trim()
                                                            : feedback.trim()}
                                                        `
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
