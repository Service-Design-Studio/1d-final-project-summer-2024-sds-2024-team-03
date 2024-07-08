import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterProduct from "../FilterProduct";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockSetSelectedProduct = jest.fn();
const products = [ "Cards", "Contact Center", "DBS Treasure", "Deposits", "Digital Banking App", "Financial GPS", "General Insurance", "Internet banking", "Investments", "Others", "PayLah!", "Payments", "Remittance", "Secured Loans", "Self-Service Banking", "Trading", "Unsecured Loans", "Webpage"]
const urlPrefix = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

describe("FilterProduct Component", () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(
        JSON.stringify(products),
        { status: 200 }
    )
    render(
    <FilterProduct
      selectedProduct={[]}
      setSelectedProduct={mockSetSelectedProduct}
    />
    );
});

  it("should have correct label", async () => {
    expect(await screen.findByLabelText(/Products/i)).toBeInTheDocument();
  });

  it("should display correct number of fetched products as options", async () => {
        fireEvent.mouseDown(screen.getByLabelText(/Products/i));
  
        const options = screen.getAllByRole("option");
        expect(options.length).toEqual(products.length);
  });

  it("should call setSelectedProduct with correct values on selection", async () => {
    fireEvent.mouseDown(await screen.findByLabelText(/Products/i));
    fireEvent.click( screen.getByText("Cards"));
    expect(mockSetSelectedProduct).toHaveBeenCalledWith(["Cards"]);
  });

  it("should display selected product as chips", async () => {
    fireEvent.mouseDown(await screen.findByLabelText(/Products/i));
    fireEvent.click( screen.getByText("Cards"));
    expect(mockSetSelectedProduct).toHaveBeenCalledWith(["Cards"]);
    await waitFor(() => {
      expect(screen.getByText("Cards")).toBeInTheDocument();
    });
  });

  it("should fetch products on mount", async () => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${urlPrefix}/analytics/filter_products`);
    products.forEach(async (product) => {
        expect(await screen.findByText(product)).toBeInTheDocument();
      });
  });
});
