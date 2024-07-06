import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Grid} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface CalendarProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
  isFrom: boolean;
}

export default function Calendar({
  setFromDate, fromDate, setToDate, toDate, isFrom
}: CalendarProps) {
  const [earliestLatestDates, setEarliestLatestDates] = useState<Record <string, Dayjs>>({})
  const theme = useTheme();

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
      if (isFrom) {
        fetch(`${urlPrefix}/analytics/get_earliest_latest_dates`)
        .then(response => response.json())
        .then(data => {
          setEarliestLatestDates({"earliestDate": dayjs(data.earliest_date, "DD/MM/YYYY"), "latestDate": dayjs(data.latest_date, "DD/MM/YYYY")});
        })
      }
  }, []);
    
    return isFrom ? 
    (
      <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              slotProps={{
                textField: {
                  required: true,
                  id: 'from-date',
                },
              }}
                format="DD/MM/YYYY"
                label="From"
                value={dayjs(fromDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  setFromDate(
                    newValue ? newValue : dayjs().subtract(1, 'week')
                  );
                }}
                minDate={earliestLatestDates["earliestDate"] ? earliestLatestDates["earliestDate"] : undefined}
                maxDate={toDate}
              />
            </LocalizationProvider>
          </Grid>
    )
    :(
      <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              slotProps={{
                textField: {
                  required: true,
                  id: 'to-date',
                },
              }}
                format="DD/MM/YYYY"
                label="To"
                value={dayjs(toDate)}
                sx={{ width: "100%" }}
                onChange={(newValue) => {
                  setToDate(
                    newValue ? newValue: dayjs()
                  );
                }}
                minDate={fromDate}
                maxDate={earliestLatestDates["latestDate"] ? earliestLatestDates["latestDate"] : undefined}
              />
            </LocalizationProvider>
          </Grid>
    );
  }
