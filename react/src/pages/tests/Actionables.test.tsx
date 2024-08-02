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
                        '["Customer posted in X claiming that she has emailed CEO to complain about digital token. Acknowledged customer\\u2019s post and assured CM that it was shared with the relevant team for necessary action. Upon further checking, CM first called on 28 Feb and CSO guided CM to set up digital token. CM wrote in to customerservice@dbs.com and not to CEO\\u2019s email address and case was escalated on 1 March. Tech investigation shows that there was no attempt of digital token set up based on logs. Customer Relations Manager (CRM) contacted customer; however, CM was abusive over the phone and requested for a senior CRM. SCRM has tried contacting CM but she was unreachable since 1 March."]',
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
                        '["Car Loan Please elaborate on why you have selected [QID4-ChoiceGroup-SelectedChoices].\\nPlease do not provide any sensitive personal information, including login passwords or one-time passwords.: Get the info on the spot", "Car Loan Please elaborate on why you have selected [QID4-ChoiceGroup-SelectedChoices].\\nPlease do not provide any sensitive personal information, including login passwords or one-time passwords.: Staff was professional and courteous over the phone. She is sharp and has high attention to details. ", "Car Loan (Optional) We have now come to the end of the survey. Before you go, please share your feedback (if any) for us to improve your DBS Car Loan experience with us.(Please do not provide any sensitive personal information, including login passwords or one-time passwords.): Prepayment fees and interest rebate is not fair."]',
                },
            ]),
            {status: 200},
        ],
        // Specific Actionables
        [
            JSON.stringify([
                // ??????????????????????????
            ]),
            {status: 200},
        ]
    );

    it("renders overview Analytics", async () => {
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
        expect(await screen.findByText(/Actionables/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
        expect(await screen.findByText(/New/i)).toBeInTheDocument();
        expect(await screen.findByText(/In Progress/i)).toBeInTheDocument();
        expect(await screen.findByText(/Done/i)).toBeInTheDocument();
        expect(screen.getAllByText(/To Fix/i).length).toBe(3);
        expect(screen.getAllByText(/To Keep In Mind/i).length).toBe(3);
        expect(screen.getAllByText(/To Promote/i).length).toBe(3);
        expect(screen.getAllByText(/To Amplify/i).length).toBe(3);
    });
});
