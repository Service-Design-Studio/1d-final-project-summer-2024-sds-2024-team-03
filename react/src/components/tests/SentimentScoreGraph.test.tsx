import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SentimentScoreGraph from "../SentimentScoreGraph";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const response = [ { "date": "02/05/2024", "sentiment_score": "2.5238095238095238" } ]
const fromDate ="01/04/2024"
const toDate = "01/07/2024"
const selectedProduct = ["Cards"]
const selectedSource = ["Call Centre"]

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
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(
        JSON.stringify(response),
        { status: 200 },
    )
});

  it("should render correctly", () => {
    renderSentimentScoreGraph();
    expect(screen.getByText(/Sentiment vs Time trend for Product\(s\) \(All Subcategories\)/i)).toBeInTheDocument();
  });

  it("should fetch overall sentiment scores data on mount when on Dashboard", async () => {
    renderSentimentScoreGraph();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
         `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
      );
    });
  });

  // it("should fetch detailed sentiment scores data on mount when on Analytics", async () => {
  //   renderSentimentScoreGraph({ isDetailed: true });
  //   await waitFor(() => {
  //     expect(fetch).toHaveBeenCalledWith(
  //       `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate}&toDate=${toDate}&product=${selectedProduct}&source=${selectedSource}`
  //     );
  //   });
  // });

  // it("should display sentiment scores correctly for overall data", async () => {
  //   renderSentimentScoreGraph();
  //   await waitFor(() => {
  //     expect(screen.getByText(/2.5/i)).toBeInTheDocument();
  //   });
  // });

  // it("should display sentiment scores correctly for detailed data", async () => {
  //   renderSentimentScoreGraph({ isDetailed: true });
  //   await waitFor(() => {
  //     expect(screen.getByText(/2.5/i)).toBeInTheDocument();
  //   });
  // });

  it("should handle empty data gracefully", async () => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(
      JSON.stringify([]),
      { status: 200 },
  )

    renderSentimentScoreGraph();
    await waitFor(() => {
      expect(screen.queryByText(/2.5/i)).not.toBeInTheDocument();
    });
  });

  it("should call setSelectedMenu on button click", async () => {
    renderSentimentScoreGraph();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
    });
  });

  // it("should allow changing selected products in detailed view", async () => {
  //   renderSentimentScoreGraph({ isDetailed: true });

  //   const productSelect = screen.getByLabelText(/Products/i);
  //   fireEvent.mouseDown(productSelect);

  //   const productOption = await screen.findByText(/Product1/i);
  //   fireEvent.click(productOption);

  //   await waitFor(() => {
  //     expect(screen.getByText(/Product1/i)).toBeInTheDocument();
  //   });
  // });

  // it("should allow changing selected subcategories in detailed view", async () => {
  //   renderSentimentScoreGraph({ isDetailed: true });

  //   const subcategorySelect = screen.getByLabelText(/Subcategories/i);
  //   fireEvent.mouseDown(subcategorySelect);

  //   const subcategoryOption = await screen.findByText(/Sub1/i);
  //   fireEvent.click(subcategoryOption);

  //   await waitFor(() => {
  //     expect(screen.getByText(/Sub1/i)).toBeInTheDocument();
  //   });
  // });
});
