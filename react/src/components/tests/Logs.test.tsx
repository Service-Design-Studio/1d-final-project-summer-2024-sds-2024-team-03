import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import Logs from "../UploadData/Logs";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

fetchMock.enableMocks();
dayjs.extend(utc);
dayjs.extend(timezone);

describe("Logs component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
    });

    it("renders correctly", () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));
        render(<Logs />);
        expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("fetches logs and renders them in the correct order", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify([
                {log_message: "Log 1", created_at: "23-07-2024T10:00:00Z"},
                {log_message: "Log 2", created_at: "24-07-2024T12:00:00Z"},
            ])
        );
        render(<Logs />);

        await waitFor(() => {
            expect(screen.getAllByRole("listitem").length).toBe(2);
        });

        const items = screen.getAllByRole("listitem");
        expect(items[0]).toHaveTextContent("Log 1");
        expect(items[0]).toHaveTextContent(
            dayjs("23-07-2024T10:00:00Z")
                .tz("Asia/Singapore")
                .format("DD-MM-YYYY HH:mm:ss")
        );
        expect(items[1]).toHaveTextContent("Log 2");
        expect(items[1]).toHaveTextContent(
            dayjs("24-07-2024T12:00:00Z")
                .tz("Asia/Singapore")
                .format("DD-MM-YYYY HH:mm:ss")
        );
    });
});
