import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import SentimentCategoriesGraph from "../SentimentCategoriesGraph";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
const response = [
    [
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
    ],
];
const fromDate = "01/04/2024";
const toDate = "01/07/2024";
const selectedProduct = ["Cards", "Deposits"];
const selectedSource = ["Product Survey", "Social Media"];

const renderSentimentCategoriesGraph = (props = {}) =>
    render(
        <SentimentCategoriesGraph
            fromDate={dayjs(dayjs(fromDate).format("DD-MM-YYYY"))}
            toDate={dayjs(dayjs(toDate).format("DD-MM-YYYY"))}
            selectedProduct={selectedProduct}
            selectedSource={selectedSource}
            isDetailed={false}
            setSelectedMenu={mockSetSelectedMenu}
            {...props}
        />
    );

describe("SentimentCategoriesGraph Component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(response), {
            status: 200,
        });
    });

    it("should render correctly for overview", () => {
        renderSentimentCategoriesGraph();
        expect(
            screen.getByText("Top 5 Positive Categories")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Top 5 Negative Categories")
        ).toBeInTheDocument();
    });

    it("should render correctly for detailed", () => {
        renderSentimentCategoriesGraph({isDetailed: true});
        expect(
            screen.getByText("Sentiment Categorisation")
        ).toBeInTheDocument();
        expect(screen.getByText("Sort")).toBeInTheDocument();
        expect(screen.getByText("View All")).toBeInTheDocument();
    });

    it("should fetch data on mount when on Dashboard", async () => {
        renderSentimentCategoriesGraph();
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should fetch data on mount when on Analytics", async () => {
        renderSentimentCategoriesGraph({isDetailed: true});
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should handle empty data gracefully for overview", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});
        renderSentimentCategoriesGraph();

        expect(screen.getAllByText("No data").length).toBe(2);
    });

    it("should handle empty data gracefully for detailed", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});
        renderSentimentCategoriesGraph({isDetailed: true});

        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("should call setSelectedMenu on button click for overview", async () => {
        renderSentimentCategoriesGraph();
        const button = screen.getByRole("button");
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
        });
    });

    it("should have clickable View All and Sort buttons, updating the interface", async () => {
        renderSentimentCategoriesGraph({isDetailed: true});
        const viewAll = screen.getByText("View All");
        fireEvent.click(viewAll);
        expect(screen.getByText("View Less")).toBeInTheDocument();
        await waitFor(async () => {
            if (screen.getByText("(Positive)")) {
                const sort = screen.getByText("Sort");
                fireEvent.click(sort);
                expect(screen.getByText("(Negative)")).toBeInTheDocument();
            }
        });
    });
});
