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

describe("Dashboard Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  fetchMock.mockResponses(
    [
      JSON.stringify({
        earliest_date: "31/08/2023",
        latest_date: "01/09/2024",
      }),
      { status: 200 }
    ],
    [
        JSON.stringify(["5 Star Review", "Call Centre", "Problem Solution Survey", "Product Survey", "Social Media"]),
        { status: 200 }
      ],
      [
        JSON.stringify([ "Cards", "Contact Center", "DBS Treasure", "Deposits", "Digital Banking App", "Financial GPS", "General Insurance", "Internet banking", "Investments", "Others", "PayLah!", "Payments", "Remittance", "Secured Loans", "Self-Service Banking", "Trading", "Unsecured Loans", "Webpage"]),
        { status: 200 }
      ],
    [
      JSON.stringify([
        { date: "01/04/2024", sentiment_score: "3.5123213" },
        { date: "01/07/2024", sentiment_score: "4.023434" }
      ]),
      { status: 200 }
    ],
    [
      JSON.stringify([
        { date: "01/01/2024", sentiment_score: "2.5546456" },
        { date: "01/04/2024", sentiment_score: "3.0689879" }
      ]),
      { status: 200 }
    ],
    [
        JSON.stringify([ { "sentiment": "Frustrated", "count": 4 }, { "sentiment": "Neutral", "count": 6 }, { "sentiment": "Satisfied", "count": 7 }, { "sentiment": "Unsatisfied", "count": 4 } ]),
        { status: 200 }
      ],
      [
        JSON.stringify([ { "date": "02/05/2024", "sentiment_score": "2.5238095238095238" } ]),
        { status: 200 }
      ],
  );
  test("renders overview dashboard", () => {
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
    expect(screen.getByText(/Overview Dashboard/i)).toBeInTheDocument();
  });

//   test("renders Calendar components", () => {
//     fetchMock.mockResponseOnce(JSON.stringify({
//         earliest_date: "31/08/2023",
//         latest_date: "01/09/2024",
//       }))
//     render(
//       <Dashboard
//         setFromDate={mockSetFromDate}
//         fromDate={dayjs()}
//         setToDate={mockSetToDate}
//         toDate={dayjs()}
//         selectedProduct={[]}
//         setSelectedProduct={mockSetSelectedProduct}
//         selectedSource={[]}
//         setSelectedSource={mockSetSelectedSource}
//         setSelectedMenu={mockSetSelectedMenu}
//       />
//     );
//     expect(screen.getAllByLabelText(/From/i)).toHaveLength(1);
//     expect(screen.getAllByLabelText(/To/i)).toHaveLength(1);
//   });

//   test("renders FilterProduct and FilterSource components", () => {
//     render(
//       <Dashboard
//         setFromDate={mockSetFromDate}
//         fromDate={dayjs()}
//         setToDate={mockSetToDate}
//         toDate={dayjs()}
//         selectedProduct={[]}
//         setSelectedProduct={mockSetSelectedProduct}
//         selectedSource={[]}
//         setSelectedSource={mockSetSelectedSource}
//         setSelectedMenu={mockSetSelectedMenu}
//       />
//     );
//     expect(screen.getByLabelText(/Products/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Sources/i)).toBeInTheDocument();
//   });
});
