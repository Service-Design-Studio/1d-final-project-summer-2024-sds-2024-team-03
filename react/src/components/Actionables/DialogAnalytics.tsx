import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableAnalytics from "./TableAnalytics";

export default function ScrollDialog() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

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

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    console.log("=> useEffect");
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    console.log("useEffect open: ", open);
  }, [open]);

  console.log("=> open:", open);

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen("paper")}
        size="small"
        variant="contained"
        color="secondary"
      >
        View Analytics
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        maxWidth="lg"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Analytics Raw Data</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <TableAnalytics />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
