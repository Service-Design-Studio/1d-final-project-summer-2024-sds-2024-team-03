import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import { SxProps } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import Zoom from "@mui/material/Zoom";
import { useTheme } from "@mui/material/styles";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { red } from "@mui/material/colors";
import { deepPurple } from "@mui/material/colors";
import { deepOrange } from "@mui/material/colors";
import { teal } from "@mui/material/colors";

export default function FormDialog() {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fabStyle: SxProps = {
    position: "fixed",
    bottom: 72,
    right: 72,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  };

  const fab = {
    color: "secondary" as "secondary",
    sx: fabStyle,
    icon: <AddIcon />,
    label: "Add",
  };

  return (
    <React.Fragment>
      <Zoom
        key={fab.color}
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        unmountOnExit
      >
        <Fab
          sx={fab.sx}
          aria-label={fab.label}
          color={fab.color}
          onClick={handleClickOpen}
        >
          {fab.icon}
        </Fab>
      </Zoom>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add an Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter an action and choose its category. The action will 
            automatically be assigned the status 'In Progress'.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="addAction"
            name="addAction"
            label="Enter Action"
            type="text"
            fullWidth
            variant="standard"
          />

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: 2 }}>
              Choose an Actionable Category
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="toFix"
                control={
                  <Radio
                    sx={{
                      color: red[800],
                      "&.Mui-checked": {
                        color: red[600],
                      },
                    }}
                  />
                }
                label="To Fix"
              />
              <FormControlLabel
                value="toKeepInMind"
                control={
                  <Radio
                    sx={{
                      color: deepPurple[800],
                      "&.Mui-checked": {
                        color: deepPurple[600],
                      },
                    }}
                  />
                }
                label="To Keep In Mind"
              />
              <FormControlLabel
                value="toPromote"
                control={
                  <Radio
                    sx={{
                      color: deepOrange[800],
                      "&.Mui-checked": {
                        color: deepOrange[600],
                      },
                    }}
                  />
                }
                label="To Promote"
              />
              <FormControlLabel
                value="toAmplify"
                control={
                  <Radio
                    sx={{
                      color: teal[800],
                      "&.Mui-checked": {
                        color: teal[600],
                      },
                    }}
                  />
                }
                label="To Amplify"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="secondary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
