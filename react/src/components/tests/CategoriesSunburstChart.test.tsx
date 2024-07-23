import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import CategoriesSunburstChart from "../Dashboard/CategoriesSunburstChart";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
const response = [
    {
        subcategory: "Credit Card",
        feedback_category: "Fee Related",
        sentiment_score: "4.5",
        date: "02/05/2024",
        product: "Cards",
        feedback: "Great!",
        source: "Product Survey",
    },
    {
        subcategory: "Fixed Deposits",
        feedback_category: "Staff Related",
        sentiment_score: "1.5",
        date: "01/06/2024",
        product: "Deposits",
        feedback: "Horrible!",
        source: "Social Media",
    },
];
const fromDate = "01/04/2024";
const toDate = "01/07/2024";
const selectedProduct = ["Cards", "Deposits"];
const selectedSource = ["Product Survey", "Social Media"];

const renderCategoriesSunburstChart = (props = {}) =>
    render(
        <CategoriesSunburstChart
            fromDate={dayjs(dayjs(fromDate).format("DD/MM/YYYY"))}
            toDate={dayjs(dayjs(toDate).format("DD/MM/YYYY"))}
            selectedProduct={selectedProduct}
            selectedSource={selectedSource}
            setSelectedMenu={mockSetSelectedMenu}
            {...props}
        />
    );

describe("CategoriesSunburstChart Component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(response), {
            status: 200,
        });
        renderCategoriesSunburstChart();
    });

    it("should render correctly", async () => {
        await waitFor(() => {
            expect(
                screen.getByText("Distribution of Categories")
            ).toBeInTheDocument();
            expect(screen.getByText("Categories")).toBeInTheDocument();
            expect(screen.getByText("Total Mentions")).toBeInTheDocument();
            expect(screen.getByText("Avg Sentiment")).toBeInTheDocument();
        });
    });

    it("should fetch overall sentiment scores data on mount", async () => {
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should handle empty data gracefully", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});
        renderCategoriesSunburstChart();
        await waitFor(() => {
            expect(screen.getByText("No data")).toBeInTheDocument();
        });
    });

    it("should call setSelectedMenu on button click for overview", async () => {
        const button = screen.getByRole("button");
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
        });
    });

    it("renders top categories sorted by mentions", async () => {
        await waitFor(() => {
            expect(
                screen.getByText(/Cards > Credit Card > Fee Related/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/4.5/i)).toBeInTheDocument();
            expect(
                screen.getByText(/Deposits > Fixed Deposits > Staff Related/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/1.5/i)).toBeInTheDocument();
            expect(screen.getAllByText("1").length).toBe(2);
            expect(screen.getAllByText(/\/ 5.0/i).length).toBe(2);
        });
    });
});
