import React from "react";
import {render, screen} from "@testing-library/react";
import Analytics from "../Analytics";
import dayjs from "dayjs";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetFromDate = jest.fn();
const mockSetToDate = jest.fn();
const mockSetSelectedProduct = jest.fn();
const mockSetSelectedSource = jest.fn();

describe("Analytics Components", () => {
    // Suppress errors, logs
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
    jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
    fetchMock.mockResponses(
        // Calendar
        [
            JSON.stringify({
                earliest_date: "31/08/2023",
                latest_date: "01/09/2024",
            }),
            {status: 200},
        ],
        // FilterProduct
        [
            JSON.stringify([
                "Cards",
                "Contact Center",
                "DBS Treasure",
                "Deposits",
                "Digital Banking App",
                "Financial GPS",
                "General Insurance",
                "Internet banking",
                "Investments",
                "Others",
                "PayLah!",
                "Payments",
                "Remittance",
                "Secured Loans",
                "Self-Service Banking",
                "Trading",
                "Unsecured Loans",
                "Webpage",
            ]),
            {status: 200},
        ],
        // FilterSource
        [
            JSON.stringify([
                "5 Star Review",
                "Call Centre",
                "Problem Solution Survey",
                "Product Survey",
                "Social Media",
            ]),
            {status: 200},
        ],
        // SentimentScoreGraph
        [
            JSON.stringify([
                {date: "02/05/2024", sentiment_score: "2.5238095238095238"},
            ]),
            {status: 200},
        ],
        // SentimentCategoriesGraph
        [
            JSON.stringify([
                {
                    subcategory: "Credit Card",
                    feedback_category: "Fee Related",
                    sentiment_score: "2.5",
                    date: "01/01/2024",
                    product: "Cards",
                    feedback: "Great!",
                    source: "Product Survey",
                },
                {
                    subcategory: "Fixed Deposits",
                    feedback_category: "Staff Related",
                    sentiment_score: "1.5",
                    date: "01/04/2024",
                    product: "Deposits",
                    feedback: "Horrible!",
                    source: "Social Media",
                },
            ]),
            {status: 200},
        ]
    );

    it("renders overview Analytics", async () => {
        render(
            <Analytics
                setFromDate={mockSetFromDate}
                fromDate={dayjs()}
                setToDate={mockSetToDate}
                toDate={dayjs()}
                selectedProduct={[]}
                setSelectedProduct={mockSetSelectedProduct}
                selectedSource={[]}
                setSelectedSource={mockSetSelectedSource}
            />
        );
        expect(await screen.findByText(/Analytics/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/To/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
        expect(
            await screen.findByText(
                /Sentiment Trend for Selected Subcategories/i
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByLabelText(/Feedback Categories/i)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Sentiment Categorisation/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/(Positive)/i)).toBeInTheDocument();
        expect(await screen.findByText(/Sort/i)).toBeInTheDocument();
        expect(await screen.findByText(/View All/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/Subcategories/i).length).toBe(2);
    });
});
