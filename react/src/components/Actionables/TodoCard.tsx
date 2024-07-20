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

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const card = (
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
          Application
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
          Credit Card
        </Typography>
      </Box>
      <Typography variant="h6" component="div">
        Actionjerg klafdsjfo eti wo4herl kngafds ;kofjgwt4k jegr afsdi fjb
        kwerasd z
      </Typography>
    </CardContent>
    <CardActions>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button size="small">View Analytics</Button>
      </Box>
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard() {
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
      <Card variant="outlined">{card}</Card>
    </Paper>
  );
}
