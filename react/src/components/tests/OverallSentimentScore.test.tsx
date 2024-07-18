import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OverallSentimentScore from "../Dashboard/OverallSentimentScore";
import fetchMock from "jest-fetch-mock";
import dayjs from "dayjs";

fetchMock.enableMocks();

const mockSetSelectedMenu = jest.fn();
const urlPrefix =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://jbaaam-yl5rojgcbq-et.a.run.app";
const curr_response = [
  { date: "01/04/2024", sentiment_score: "3.5123213" },
  { date: "01/07/2024", sentiment_score: "4.023434" },
];
const prev_response = [
  { date: "01/01/2024", sentiment_score: "2.5546456" },
  { date: "01/04/2024", sentiment_score: "3.0689879" },
];
const selectedProduct = ["Cards"];
const selectedSource = ["Call Centre"];

describe("OverallSentimentScore Component", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
    jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
    fetchMock.resetMocks();
    fetchMock.mockResponses(
      [JSON.stringify(curr_response), { status: 200 }],
      [JSON.stringify(prev_response), { status: 200 }]
    );
    render(
      <OverallSentimentScore
        fromDate={dayjs(dayjs(curr_response[0]["date"]).format("DD/MM/YYYY"))}
        toDate={dayjs(dayjs(curr_response[1]["date"]).format("DD/MM/YYYY"))}
        selectedProduct={selectedProduct}
        selectedSource={selectedSource}
        setSelectedMenu={mockSetSelectedMenu}
      />
    );
  });

  it("should render correctly", () => {
    expect(screen.getByText(/Overall Sentiment Score/i)).toBeInTheDocument();
  });

  it("should fetch current and then previous sentiment scores on mount", async () => {
    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${curr_response[0]["date"]}&toDate=${curr_response[1]["date"]}&product=${selectedProduct}&source=${selectedSource}`
      );
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${urlPrefix}/analytics/get_overall_sentiment_scores?fromDate=${prev_response[0]["date"]}&toDate=${prev_response[1]["date"]}&product=${selectedProduct}&source=${selectedSource}`
        );
      });
    });
  });

  it("should display the overall sentiment score", async () => {
    await waitFor(() => {
      expect(screen.getByText("3.8/5")).toBeInTheDocument();
    });
  });

  it("should calculate and display the sentiment score change", async () => {
    await waitFor(() => {
      expect(screen.getByText(/↑ 34% Increase/i)).toBeInTheDocument();
    });
  });

  it("should display 'Not Applicable' if no change data", async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponses(
      [JSON.stringify(curr_response), { status: 200 }],
      [JSON.stringify([]), { status: 200 }]
    );

    await waitFor(() => {
      expect(screen.getByText(/Not Applicable/i)).toBeInTheDocument();
    });
  });

  it("should call setSelectedMenu on button click", async () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockSetSelectedMenu).toHaveBeenCalledWith("analytics");
    });
  });
});
