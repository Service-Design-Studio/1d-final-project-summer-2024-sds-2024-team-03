// NEED REACT EVEN IF NO USE
import React from "react";
import {render, screen} from "@testing-library/react";
import Dashboard from "../Dashboard";
import dayjs from "dayjs";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetFromDate = jest.fn();
const mockSetToDate = jest.fn();
const mockSetSelectedProduct = jest.fn();
const mockSetSelectedSource = jest.fn();
const mockSetSelectedMenu = jest.fn();

describe("Dashboard Components", () => {
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
        // OverallSentimentScore first fetch
        [
            JSON.stringify([
                {date: "01/04/2024", sentiment_score: "3.5123213"},
                {date: "01/07/2024", sentiment_score: "4.023434"},
            ]),
            {status: 200},
        ],
        // SentimentDistribution
        [
            JSON.stringify([
                {sentiment: "Frustrated", count: 4},
                {sentiment: "Neutral", count: 6},
                {sentiment: "Satisfied", count: 7},
                {sentiment: "Unsatisfied", count: 4},
            ]),
            {status: 200},
        ],
        // Actions Completed
        [
            JSON.stringify([
                {
                    id: 727,
                    action: "Improve communication and escalation processes within the DBS Hotline to ensure timely and effective resolution of customer issues, particularly those involving digital token setup.",
                    status: "In Progress",
                    subproduct: "DBS Hotline",
                    actionable_category: "To Fix",
                    feedback_category: '["Staff Related"]',
                    feedback_json:
                        '["redacted"]',
                },
                {
                    id: 728,
                    action: "Review and potentially adjust prepayment fees and interest rebate policies to ensure fairness and transparency for customers.",
                    status: "Done",
                    subproduct: "Car Loan",
                    actionable_category: "To Promote",
                    feedback_category:
                        '["Process Related", "Technical Issue/System", "Charges/Fees & Interest"]',
                    feedback_json:
                        '["redacted1", "redacted2"]',
                },
            ]),
            {status: 200},
        ]
        // SentimentScoreGraph
        [
            JSON.stringify([
                {date: "02/05/2024", sentiment_score: "2.5238095238095238"},
            ]),
            {status: 200},
        ],
        // OverallSentimentScore second fetch within nested fetch
        [
            JSON.stringify([
                {date: "01/01/2024", sentiment_score: "2.5546456"},
                {date: "01/04/2024", sentiment_score: "3.0689879"},
            ]),
            {status: 200},
        ],
        // CategoriesSunburstChart  :sentiment_score, :date, :product, :subcategory, :feedback_category, :feedback, :source
        [
            JSON.stringify([
                {
                    subcategory: "Credit Card",
                    feedback_category: "Fee Related",
                    sentiment_score: "4.5",
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

    it("renders overview dashboard", async () => {
        render(
            <Dashboard
                setFromDate={mockSetFromDate}
                fromDate={dayjs()}
                setToDate={mockSetToDate}
                toDate={dayjs()}
                selectedProduct={[]}
                setSelectedProduct={mockSetSelectedProduct}
                selectedSource={[]}
                setSelectedSource={mockSetSelectedSource}
                setSelectedMenu={mockSetSelectedMenu}
            />
        );
        expect(
            await screen.findByText(/Overview Dashboard/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/Generate Report/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/To/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/Overall Sentiment Score/i)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Distribution of Sentiment/i)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Actionables Tracked/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/Done/i)).toBeInTheDocument();
        expect(await screen.findByText(/In Progress/i)).toBeInTheDocument();
        expect(
            await screen.findByText("Sentiment Trend for Selected Product(s)")
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/across all subcategories/i)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Top 5 Positive Categories/i)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Top 5 Negative Categories/i)
        ).toBeInTheDocument();
    });
});
