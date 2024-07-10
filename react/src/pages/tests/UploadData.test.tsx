// NEED REACT EVEN IF NO USE
import React from "react";
import { render, screen } from "@testing-library/react";
import UploadData from "../UploadData";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetSelectedProduct = jest.fn();
const mockSetSelectedSource = jest.fn();

describe("Dashboard Components", () => {
    // Suppress errors, logs, warn
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());
    fetchMock.mockResponses(
    // FilterProduct
    [
        JSON.stringify([ "Cards", "Contact Center", "DBS Treasure", "Deposits", "Digital Banking App", "Financial GPS", "General Insurance", "Internet banking", "Investments", "Others", "PayLah!", "Payments", "Remittance", "Secured Loans", "Self-Service Banking", "Trading", "Unsecured Loans", "Webpage"]),
        { status: 200 }
    ],
    // FilterSource
    [
      JSON.stringify(["5 Star Review", "Call Centre", "Problem Solution Survey", "Product Survey", "Social Media"]),
      { status: 200 }
    ],
    // FileDrop
    [
      JSON.stringify([
        { date: "01/01/2024", sentiment_score: "2.5546456" },
        { date: "01/04/2024", sentiment_score: "3.0689879" }
      ]),
      { status: 200 }
    ],
  );

  it("renders Upload Data page", async () => {
    render(
      <UploadData
        selectedProduct={[]}
        setSelectedProduct={mockSetSelectedProduct}
        selectedSource={[]}
        setSelectedSource={mockSetSelectedSource}
      />
    );
    expect(await screen.findByText(/Upload Data/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
    expect(await screen.findByText("Drag and drop .csv/.xls* files here")).toBeInTheDocument();
  });
});
