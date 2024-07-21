import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function BasicList() {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Feedback in the morning sun shine on the ATM  machine is too bright and therefore not able to see anything on the screen feedback should put some sunshine blinds  ayer rajah market, infront of ntuc ATM screen not clear due to the sun (left machine)" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Cm work at grassroots and he take his own money to help the community exchange their coins to cash. Hence he end up with many coins to deposit. He heard rumours that the DBS CDM always spoil and best to us POSB CDM instead. His experience with tanjong pagar AND tiong bahru has always been smooth, having the coins deposit complete in les than 60 seconds while the CDM at DBS says will take a while." />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
