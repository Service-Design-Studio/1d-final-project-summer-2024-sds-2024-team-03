// NEED REACT EVEN IF NO USE
import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import UploadData from "../UploadData";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("UploadData Components", () => {
    beforeEach(() => {
        // Suppress errors, logs, warn
        jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
        jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn());
        fetchMock.mockResponses(
            // FilterSubcategory
            [
                JSON.stringify([
                    "Debit Card",
                    "Credit Card",
                    "Cashline",
                    "Personal Loan",
                    "Renovation Loan",
                    "Education Loan",
                    "Car Loan",
                    "Mortgage/Home Loan",
                    "DigiBank App",
                    "Internet Banking(iBanking)",
                    "Paylah!",
                    "digiPortfolio",
                    "Non-Unit Trust/Equities",
                    "Unit Trust",
                    "Vickers",
                    "Treasures Relationship Manager(RM)",
                    "DBS Wealth Planning Manager",
                    "DBS Treasures (General)",
                    "SSB",
                    "VTM(Video Teller Machine)",
                    "Phone Banking",
                    "Coin Deposit Machine",
                    "General Insurance",
                    "Life Insurance",
                    "DBS Deposit Account",
                    "Payments",
                    "PayNow",
                    "Cheque",
                    "GIRO",
                    "digiVault",
                    "DBS Hotline",
                    "DBS Branches/Staff",
                    "Contact Center",
                    "Websites",
                    "Overseas Transfer",
                    "Others",
                ]),
                {status: 200},
            ],
            // Logs from UploadData
            [
                JSON.stringify([
                    {
                        log_message:
                            "Error: No date column identified. Date column is required for processing",
                        created_at: "2024-07-24T20:19:36.534Z",
                    },
                    {
                        log_message:
                            "Upload Successful. Filename: uploads/Others__Social Media__invalid_no_date_SM .csv. Data classification started",
                        created_at: "2024-07-24T20:20:07.097Z",
                    },
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
            // FileDrop from UploadData
            [
                JSON.stringify({
                    message: "File uploaded successfully",
                    url: "https://storage.googleapis.com/jbaaam_upload/uploads/example.csv",
                }),
                {status: 200},
            ]
        );
        render(<UploadData />);
    });

    it("renders Upload Data page", async () => {
        expect(await screen.findByText(/Upload Data/i)).toBeInTheDocument();
        expect(
            await screen.findByLabelText(/Subcategory/i)
        ).toBeInTheDocument();
        expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
        expect(
            await screen.findByText("Drag and drop CSV files here")
        ).toBeInTheDocument();
    });
});
