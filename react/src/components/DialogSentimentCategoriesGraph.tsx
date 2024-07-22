import React, {useState, useEffect} from "react";
import { Theme, useTheme } from "@mui/material/styles";
import {styled} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
    Paper,
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
} from "@mui/material";

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

export default function ScrollDialog() {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

    const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
        setOpen(true);
        //setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {}, [open]);
    function createData(
        Date: string,
        Feedback: string,
        Product: string,
        Subcategory: string,
        Source: string,
        Feedbackcategory: string,
        Sentiment: string,
        SentimentScore: number
    ) {
        return {
            Date,
            Feedback,
            Product,
            Subcategory,
            Source,
            Feedbackcategory,
            Sentiment,
            SentimentScore,
        };
    }

    const rows = [
        createData(
            "11/0/2023",
            "PayNow not working",
            "Digital Banking App",
            "PayNow",
            "Social Media",
            "Payment Error",
            "Unhappy",
            1.0
        ),
        createData(
            "11/0/2023",
            "PaNnow not working",
            "Digital Banking App",
            "PayNow",
            "Social Media",
            "Payment Error",
            "Unhappy",
            1.0
        ),
    ];

    const theme = useTheme();

    return (
    <React.Fragment>
        <Button onClick={handleClickOpen("paper")}
          sx={{
            borderRadius: 4,
            fontWeight: 'bold',
            fontSize: '1rem',
            height: 50,
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              theme.palette.mode === "dark" ? "#555" : "#666",
            transition: "transform 0.3s ease-in-out",
            color: "#fff",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#666" : "#555",
              transform: "scaleX(1.01) scaleY(1.02)",
            },
          }}>View Analytics
        </Button>
        <Dialog
            PaperProps={{ style: {borderRadius: 18} }}
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
                    fontWeight: "bold"
                }}
            >
                Analytics Raw Data
                <Button 
                    onClick={handleClose} 
                    sx={{borderRadius: 4}}> 
                    <CloseIcon /> 
                </Button>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <TableContainer component={Paper} sx={{borderRadius: 4, mt:1, mb:1, boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)'}}>
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
                                        Product
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Subcategory
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Source
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Feedback Category
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Sentiment
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Sentiment Score
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.Date}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.Date}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Feedback}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Product}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Subcategory}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Source}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Feedbackcategory}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.Sentiment}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.SentimentScore}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    </React.Fragment>
    );
}
