import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  Date: string,
  Feedback: string,
  Product: string,
  Subproduct: string,
  Source: string,
  FeedbackCategory: string,
  Sentiment: string,
  SentimentScore: number
) {
  return {
    Date,
    Feedback,
    Product,
    Subproduct,
    Source,
    FeedbackCategory,
    Sentiment,
    SentimentScore,
  };
}

const rows = [
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.4
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
  createData(
    "11/0/2023",
    "Paynow not working",
    "Digital Banking App",
    "Paynow",
    "Social Media",
    "Payment Error",
    "Unhappy",
    1.0
  ),
];

export default function CustomizedTables() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell align="right">Feedback</StyledTableCell>
            <StyledTableCell align="right">Product</StyledTableCell>
            <StyledTableCell align="right">Subproduct</StyledTableCell>
            <StyledTableCell align="right">Source</StyledTableCell>
            <StyledTableCell align="right">Feedback Category</StyledTableCell>
            <StyledTableCell align="right">Sentiment</StyledTableCell>
            <StyledTableCell align="right">Sentiment Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.Date}>
              <StyledTableCell component="th" scope="row">
                {row.Date}
              </StyledTableCell>
              <StyledTableCell align="right">{row.Feedback}</StyledTableCell>
              <StyledTableCell align="right">{row.Product}</StyledTableCell>
              <StyledTableCell align="right">{row.Subproduct}</StyledTableCell>
              <StyledTableCell align="right">{row.Source}</StyledTableCell>
              <StyledTableCell align="right">
                {row.FeedbackCategory}
              </StyledTableCell>
              <StyledTableCell align="right">{row.Sentiment}</StyledTableCell>
              <StyledTableCell align="right">
                {row.SentimentScore}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
