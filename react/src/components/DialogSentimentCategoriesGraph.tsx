import React, {useState, useEffect} from "react";
import Button from "@mui/material/Button";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableSentimentCategoriesGraph from "./TableSentimentCategoriesGraph";

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

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen("paper")}>View Analytics</Button>
            <Dialog
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
                    }}
                >
                    Analytics Raw Data
                    <Button onClick={handleClose}>X</Button>
                </DialogTitle>
                <DialogContent dividers={scroll === "paper"}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <TableSentimentCategoriesGraph />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
