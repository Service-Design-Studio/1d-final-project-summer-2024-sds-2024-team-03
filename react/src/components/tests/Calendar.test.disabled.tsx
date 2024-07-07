import React from "react";
import { render, screen, fireEvent} from "@testing-library/react";
import Calendar from "../Calendar";
import dayjs from "dayjs";
import fetchMock from "jest-fetch-mock";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

fetchMock.enableMocks();

const mockSetFromDate = jest.fn();
const mockSetToDate = jest.fn();
const urlPrefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

describe("Calendar Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(
          JSON.stringify({
            earliest_date: "01/04/2023",
            latest_date: "31/08/2024",
          }),
          { status: 200 }
)
    render(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar
          setFromDate={mockSetFromDate}
          fromDate={dayjs().subtract(1, 'week')}
          setToDate={mockSetToDate}
          toDate={ dayjs()}
        />
        </LocalizationProvider>
    );
  });

    const testDatePicker = async (labelText: string, day: number, month: number, year: number) => {
        const datePicker = await screen.findByLabelText(labelText)
        const zeroPad = (num: number) => String(num).padStart(2, '0')
        const dayString = zeroPad(day)
        const monthString = zeroPad(month)
        const yearString = String(year)
        const dateText = `${monthString}/${dayString}/${yearString}`
        fireEvent.change(datePicker, {target: {value: dateText}})
        const datePickerValue = `${dayString}/${monthString}/${yearString}`
        expect(datePicker).toHaveValue(datePickerValue)
}

  it("should have correct labels", async () => {
    expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/To/i)).toBeInTheDocument();
  });

  it("should initialize date pickers with correct values", async () => {
    expect(await screen.findByLabelText(/From/i)).toHaveValue(dayjs().subtract(1, 'week').format("DD/MM/YYYY"));
    expect(await screen.findByLabelText(/To/i)).toHaveValue(dayjs().format("DD/MM/YYYY"));
  });

  it("should update fromDate when a new date is selected", async () => {
    testDatePicker("/From/i", 1, 4,2024)
    expect(await screen.findByLabelText(/From/i)).toHaveAttribute("aria-invalid", "false");
});

  it("should update toDate when a new date is selected", async () => {
    testDatePicker("/To/i", 1, 7,2024)
    expect(await screen.findByLabelText(/To/i)).toHaveAttribute("aria-invalid", "false");
});

  it("should fetch earliest and latest dates and have correct min and max dates", async () => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${urlPrefix}/analytics/get_earliest_latest_dates`);

    fireEvent.change(await screen.findByLabelText(/From/i), {target: {value: '30/03/2023'}})
    expect(await screen.findByLabelText(/From/i)).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(await screen.findByLabelText(/To/i), {target: {value: '02/09/2024'}})
    expect(await screen.findByLabelText(/To/i)).toHaveAttribute("aria-invalid", "true");
  });
});
