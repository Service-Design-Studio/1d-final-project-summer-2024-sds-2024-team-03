import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import SentimentScoreGraph from "../SentimentScoreGraph";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
const overviewResponse = [
    {date: "02/05/2024", sentiment_score: "2.5238095238095238"},
];
const detailedResponse = [
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

const renderSentimentScoreGraph = (props = {}) =>
    render(
        <SentimentScoreGraph
            fromDate={dayjs(dayjs(fromDate).format("DD/MM/YYYY"))}
            toDate={dayjs(dayjs(toDate).format("DD/MM/YYYY"))}
            selectedProduct={selectedProduct}
            selectedSource={selectedSource}
            isDetailed={false}
            setSelectedMenu={mockSetSelectedMenu}
            {...props}
        />
    );

describe("SentimentScoreGraph Component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
    });

    it("should render correctly", () => {
        fetchMock.mockResponseOnce(JSON.stringify(overviewResponse), {
            status: 200,
        });
        renderSentimentScoreGraph();

        expect(
            screen.getByText("Sentiment Trend for Selected Product(s)")
        ).toBeInTheDocument();

        expect(
            screen.getByText("across all subcategories")
        ).toBeInTheDocument();
    });

    it("should fetch overall sentiment scores data on mount when on Dashboard", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(overviewResponse), {
            status: 200,
        });
        renderSentimentScoreGraph();

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should fetch detailed sentiment scores data on mount when on Analytics", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(detailedResponse), {
            status: 200,
        });
        renderSentimentScoreGraph({isDetailed: true});

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
            );
        });
    });

    it("should handle empty data gracefully for overview", async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});

        renderSentimentScoreGraph();
        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("should handle empty data gracefully for detailed", async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});

        renderSentimentScoreGraph({isDetailed: true});
        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("should call setSelectedMenu on button click for overview", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(overviewResponse), {
            status: 200,
        });
        renderSentimentScoreGraph();

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);
        await waitFor(() => {
            expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
        });
    });

    it("handles subcategory and feedback category selection for detailed", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(detailedResponse), {
            status: 200,
        });
        renderSentimentScoreGraph({isDetailed: true});

        const subcategorySelect = screen.getByLabelText("Subcategories");
        const feedbackcategorySelect = screen.getByLabelText(
            "Feedback Categories"
        );
        expect(feedbackcategorySelect).toHaveAttribute("aria-disabled");

        fireEvent.mouseDown(subcategorySelect);
        fireEvent.mouseDown(feedbackcategorySelect);
    });
});
