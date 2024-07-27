import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import RotateRightTwoToneIcon from "@mui/icons-material/RotateRightTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

import DialogAnalytics from "./DialogAnalytics";

//IMPORT INTERFACE
import { Actionable } from "./Interfaces";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

interface MyCardProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  actionable: Actionable;
}

const MyCard: React.FC<MyCardProps> = ({
  anchorEl,
  open,
  handleClick,
  handleClose,
  actionable,
}) => {
  const feedbackCategory = actionable.feedback_category;
  let uniqueData; //uniqueData is used in the scope(try catch) and in render, therefore need declare outside
  try {
    const x = JSON.parse(feedbackCategory); //convert back to JSON
    uniqueData = Array.from(new Set(x)).join(", "); //dedupe and convert to comma separated string
  } catch {
    uniqueData = feedbackCategory; // in case string isn't proper JSON
  }

  return (
    <React.Fragment>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 14, mr: 1 }}
            color="text.secondary"
            gutterBottom
          >
            Feedback Category:
          </Typography>
          <Box flexGrow={1} />
          <Typography
            sx={{ fontSize: 14, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
          >
            {uniqueData}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 14, mr: 1 }}
            color="text.secondary"
            gutterBottom
          >
            Subproduct:
          </Typography>
          <Box flexGrow={1} />
          <Typography
            sx={{ fontSize: 14, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
          >
            {actionable.subproduct}
          </Typography>
        </Box>
        <Typography variant="h6" component="div">
          {actionable.action} {actionable.status}
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <DeleteTwoToneIcon style={{ color: "#808080" }} />
          <Button
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            size="small"
            color="secondary"
          >
            Change Status
          </Button>
          <DialogAnalytics />
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <NewReleasesTwoToneIcon style={{ color: "#8D1927" }} />
              </ListItemIcon>
              <ListItemText primary="New" style={{ color: "#8D1927" }} />
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <RotateRightTwoToneIcon style={{ color: "#DA5707" }} />
              </ListItemIcon>
              <ListItemText
                primary="In Progress"
                style={{ color: "#DA5707" }}
              />
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <CheckCircleTwoToneIcon style={{ color: "#208306" }} />
              </ListItemIcon>
              <ListItemText primary="Done" style={{ color: "#208306" }} />
            </MenuItem>
          </Menu>
        </Box>
      </CardActions>
    </React.Fragment>
  );
};

// MAIN CARD
export default function OutlinedCard(actionable: Actionable) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Paper elevation={2} sx={{ minWidth: 275, mb: 2 }}>
      <Card variant="outlined">
        <MyCard
          anchorEl={anchorEl}
          open={open}
          handleClick={handleClick}
          handleClose={handleClose}
          actionable={actionable}
        />
      </Card>
    </Paper>
  );
}
