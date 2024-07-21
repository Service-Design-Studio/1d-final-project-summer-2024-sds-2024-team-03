import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface CalendarProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
}

export default function Calendar({
  setFromDate,
  fromDate,
  setToDate,
  toDate,
}: CalendarProps) {
  const [earliestLatestDates, setEarliestLatestDates] = useState<
    Record<string, Dayjs>
  >({});
  const theme = useTheme();

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
    fetch(`${urlPrefix}/analytics/get_earliest_latest_dates`)
      .then((response) => response.json())
      .then((data) => {
        setEarliestLatestDates({
          earliestDate: dayjs(data.earliest_date, "DD/MM/YYYY"),
          latestDate: dayjs(data.latest_date, "DD/MM/YYYY"),
        });
      });
  }, []);

  return (
    <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{
            textField: {
              required: true,
              id: "from-date",
              sx: { 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' ? '#bbb' : '#555',
                }
              },
              InputLabelProps: {
                sx: { fontWeight: 'bold' }}
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: 4,
                  mt: 2,
                  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)'
                }
              }
            }
          }}
          format="DD-MM-YYYY"
          label="From"
          value={dayjs(fromDate)}
          sx={{ width: "100%" }}
          onChange={(newValue) => {
            setFromDate(newValue ? newValue : dayjs().subtract(1, "week"));
          }}
          minDate={
            earliestLatestDates["earliestDate"]
              ? earliestLatestDates["earliestDate"]
              : undefined
          }
          maxDate={toDate}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{
            textField: {
              required: true,
              id: "to-date",
              sx: { 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' ? '#bbb' : '#555',
                }
              },
              InputLabelProps: {
                sx: { fontWeight: 'bold' }}
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: 4,
                  mt: 2,
                }
              }
            }
          }}
          format="DD-MM-YYYY"
          label="To"
          value={dayjs(toDate)}
          sx={{ width: "100%" }}
          onChange={(newValue) => {
            setToDate(newValue ? newValue : dayjs());
          }}
          minDate={fromDate}
          maxDate={
            earliestLatestDates["latestDate"]
              ? earliestLatestDates["latestDate"]
              : undefined
          }
        />
      </LocalizationProvider>
    </Grid>
  );
}
