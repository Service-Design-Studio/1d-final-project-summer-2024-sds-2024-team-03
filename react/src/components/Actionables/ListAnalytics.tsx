import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { Actionable } from "./Interfaces";

export default function BasicList(actionable: Actionable) {
  let feedbackJson = actionable.feedback_json;
  let x;
  try {
    console.log("feedbackJson", feedbackJson);
    x = JSON.parse(feedbackJson);
    if (Array.isArray(x) && x.length === 1 && x[0] === null) {
      x = null;
    }
  } catch {
    feedbackJson = actionable.feedback_json;
    x = null;
  }
  console.log("x", x);
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          {x === null || x.length === 0 ? (
            <Typography>No data available</Typography>
          ) : (
            x.map((item: string, index: number) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </nav>
    </Box>
  );
}
