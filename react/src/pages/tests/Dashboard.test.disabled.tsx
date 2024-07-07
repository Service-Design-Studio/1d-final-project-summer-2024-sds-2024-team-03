// NEED REACT EVEN IF NO USE
import React from "react";
import { render, screen } from "@testing-library/react";
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
  fetchMock.mockResponses(
    // Calendar
    [
      JSON.stringify({
        earliest_date: "31/08/2023",
        latest_date: "01/09/2024",
      }),
      { status: 200 }
    ],
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
    // OverallSentimentScore first fetch
    [
      JSON.stringify([
        { date: "01/04/2024", sentiment_score: "3.5123213" },
        { date: "01/07/2024", sentiment_score: "4.023434" }
      ]),
      { status: 200 }
    ],
    // SentimentDistribution
    [
        JSON.stringify([ { "sentiment": "Frustrated", "count": 4 }, { "sentiment": "Neutral", "count": 6 }, { "sentiment": "Satisfied", "count": 7 }, { "sentiment": "Unsatisfied", "count": 4 } ]),
        { status: 200 }
    ],
    // SentimentScoreGraph
    [
      JSON.stringify([ { "date": "02/05/2024", "sentiment_score": "2.5238095238095238" } ]),
      { status: 200 }
    ],
    // OverallSentimentScore second fetch within nested fetch
    [
      JSON.stringify([
        { date: "01/01/2024", sentiment_score: "2.5546456" },
        { date: "01/04/2024", sentiment_score: "3.0689879" }
      ]),
      { status: 200 }
    ],
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
    expect(await screen.findByText(/Overview Dashboard/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/From/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/To/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
    expect(await screen.findByText(/Overall Sentiment Score/i)).toBeInTheDocument();
    expect(await screen.findByText(/Distribution of Sentiment/i)).toBeInTheDocument();
    expect(await screen.findByText(/To Promote/i)).toBeInTheDocument();
    expect(await screen.findByText(/To Amplify/i)).toBeInTheDocument();
    expect(await screen.findByText(/Keep in Mind/i)).toBeInTheDocument();
    expect(await screen.findByText(/To Fix/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sentiment vs Time trend for Product\(s\) \(All Subcategories\)/i)).toBeInTheDocument();
    expect(await screen.findByText(/Top 5 Positive Subcategories/i)).toBeInTheDocument();
    // expect(await screen.findByText(/Top 5 Negative Subcategories/i)).toBeInTheDocument();
  });
});
