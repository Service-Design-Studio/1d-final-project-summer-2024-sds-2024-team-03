import React from "react";
import {render, screen} from "@testing-library/react";
import Actionables from "../Actionables";
import dayjs from "dayjs";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetFromDate = jest.fn();
const mockSetToDate = jest.fn();
const mockSetSelectedProduct = jest.fn();
const mockSetSelectedSource = jest.fn();

describe("Actionables Components", () => {
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
        // Specific Actionables
        [
            JSON.stringify([
                {
                    message:
                        "Actionable items processed and stored successfully",
                },
            ]),
            {status: 200},
        ],
        [
            JSON.stringify([
                {
                    message:
                        "Actionable items processed and stored successfully",
                },
            ]),
            {status: 200},
        ],
        // Actionables count
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
    );

    it("renders overview Actionables", async () => {
        render(
            <Actionables
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
        expect(screen.getAllByText(/Actionables/i).length).toBe(2);
        expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/Generated Actions/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/In Progress/i)).toBeInTheDocument();
        expect(await screen.findByText(/Done/i)).toBeInTheDocument();
        expect(await screen.findByText(/No data/i)).toBeInTheDocument();
        expect(screen.getAllByText(/To Fix/i).length).toBe(2);
        expect(screen.getAllByText(/To Keep In Mind/i).length).toBe(2);
        expect(screen.getAllByText(/To Amplify/i).length).toBe(2);
        expect(screen.getAllByText(/To Promote/i).length).toBe(2);
    });
});
