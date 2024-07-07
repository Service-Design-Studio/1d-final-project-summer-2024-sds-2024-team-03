import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterSource from "../FilterSource";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetSelectedSource = jest.fn();
const sources = ["5 Star Review", "Call Centre", "Problem Solution Survey", "Product Survey", "Social Media"]
const urlPrefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

describe("FilterSource Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(
        JSON.stringify(sources),
        { status: 200 }
    )
    render(
    <FilterSource
      selectedSource={[]}
      setSelectedSource={mockSetSelectedSource}
    />
    );
});

  it("should have correct label", async () => {
    expect(await screen.findByLabelText(/Sources/i)).toBeInTheDocument();
  });

  it("should display correct number of fetched sources as options", async () => {
        fireEvent.mouseDown(screen.getByLabelText(/Sources/i));
        const options = screen.getAllByRole("option");
        expect(options.length).toEqual(sources.length);
  });

  it("should call setSelectedSource with correct values on selection", async () => {
    fireEvent.mouseDown(await screen.findByLabelText(/Sources/i));
    fireEvent.click( screen.getByText("Call Centre"));
    expect(mockSetSelectedSource).toHaveBeenCalledWith(["Call Centre"]);
  });

  it("should display selected source as chips", async () => {
    fireEvent.mouseDown(await screen.findByLabelText(/Sources/i));
    fireEvent.click( screen.getByText("Call Centre"));
    expect(mockSetSelectedSource).toHaveBeenCalledWith(["Call Centre"]);
    await waitFor(() => {
      expect(screen.getByText("Call Centre")).toBeInTheDocument();
    });
  });

  it("should fetch sources on mount", async () => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${urlPrefix}/analytics/filter_sources`);
    sources.forEach(async (source) => {
        expect(await screen.findByText(source)).toBeInTheDocument();
      });
  });
});
