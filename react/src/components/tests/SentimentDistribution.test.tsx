import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import SentimentDistribution from "../Dashboard/SentimentDistribution";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
const response = [
    {sentiment: "Frustrated", count: 4},
    {sentiment: "Neutral", count: 6},
    {sentiment: "Satisfied", count: 7},
    {sentiment: "Unsatisfied", count: 4},
];
const fromDate = "01/04/2024";
const toDate = "01/07/2024";
const selectedProduct = ["Cards"];
const selectedSource = ["Call Centre"];

describe("SentimentDistribution Component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(response), {status: 200});
        render(
            <SentimentDistribution
                fromDate={dayjs(dayjs(fromDate).format("DD/MM/YYYY"))}
                toDate={dayjs(dayjs(toDate).format("DD/MM/YYYY"))}
                selectedProduct={selectedProduct}
                selectedSource={selectedSource}
                setSelectedMenu={mockSetSelectedMenu}
            />
        );
    });

    it("should render correctly", () => {
        expect(
            screen.getByText(/Distribution of Sentiment/i)
        ).toBeInTheDocument();
    });

    it("should fetch sentiment distribution data on mount", async () => {
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_sentiments_distribution?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should display sentiment distribution percentages correctly", async () => {
        await waitFor(() => {
            expect(screen.getByText(/Frustrated/i)).toBeInTheDocument();
            expect(screen.getByText("Unsatisfied")).toBeInTheDocument();
            expect(screen.getAllByText(/19.0%/i).length).toBeGreaterThan(0);
            expect(screen.getByText(/Neutral/i)).toBeInTheDocument();
            expect(screen.getByText(/28.6%/i)).toBeInTheDocument();
            expect(screen.getByText("Satisfied")).toBeInTheDocument();
            expect(screen.getByText(/33.3%/i)).toBeInTheDocument();
            expect(screen.getByText(/Promoter/i)).toBeInTheDocument();
            expect(screen.getByText("0%")).toBeInTheDocument();
        });
    });

    it("should handle empty data gracefully", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});
        await waitFor(() => {
            expect(screen.getByText(/Frustrated/i)).toBeInTheDocument();
            expect(screen.getByText("Unsatisfied")).toBeInTheDocument();
            expect(screen.getByText(/Neutral/i)).toBeInTheDocument();
            expect(screen.getByText("Satisfied")).toBeInTheDocument();
            expect(screen.getByText(/Promoter/i)).toBeInTheDocument();
            expect(screen.getByText("0%")).toBeInTheDocument();
        });
    });

    it("should call setSelectedMenu on button click", async () => {
        const button = screen.getByRole("button");
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
        });
    });
});
