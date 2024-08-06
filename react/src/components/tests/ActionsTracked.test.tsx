import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import ActionsTracked from "../Dashboard/ActionsTracked";
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
];

const renderActionsTracked = (props = {}) =>
    render(<ActionsTracked setSelectedMenu={mockSetSelectedMenu} {...props} />);

describe("ActionsTracked Component", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(response), {
            status: 200,
        });
    });

    it("should render correctly", () => {
        renderActionsTracked();
        expect(screen.getByText("Actionables Tracked")).toBeInTheDocument();
        expect(screen.getByText("Done")).toBeInTheDocument();
        expect(screen.getByText("In Progress")).toBeInTheDocument();
        expect(screen.getAllByText("0").length).toBe(2);
    });

    it("should fetch data on mount when on Dashboard", async () => {
        renderActionsTracked();
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${urlPrefix}/actionables.json`);
        });
    });

    it("should handle empty data gracefully", async () => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify([]), {status: 200});
        renderActionsTracked();

        expect(screen.getByText("No actionables tracked")).toBeInTheDocument();
    });

    it("should call setSelectedMenu on button click", async () => {
        renderActionsTracked();
        const button = screen.getByRole("button");
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockSetSelectedMenu).toHaveBeenCalledWith("actionables");
        });
    });
});
