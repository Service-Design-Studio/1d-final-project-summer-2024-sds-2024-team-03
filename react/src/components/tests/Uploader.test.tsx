import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileDrop } from "../UploadData/Uploader";
import fetchMock from "jest-fetch-mock";
import * as XLSX from "xlsx";

fetchMock.enableMocks();

const selectedSubcategory = "Cards";
const selectedSource = ["Call Centre"];

describe("FileDrop Component", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
    jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
  });

  it("renders correctly", () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument();
  });

  it("shows gray background on drag over", () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    const dropZone = screen.getByTestId("drop-zone");
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveStyle("backgroundColor: gray");
  });

  it("shows #ccc background on drag leave", () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    const dropZone = screen.getByTestId("drop-zone");
    fireEvent.dragOver(dropZone);
    fireEvent.dragLeave(dropZone);
    expect(dropZone).toHaveStyle("backgroundColor: #ccc");
  });

  it("shows error modal when product or source is empty", async () => {
    render(<FileDrop selectedSubcategory={""} selectedSource={[]} />);
    const dropZone = screen.getByTestId("drop-zone");
    const mockDataTransfer = {
      files: [new File(["content"], "test.csv", { type: "text/csv" })],
      items: [],
      types: [],
      setData: jest.fn(),
      getData: jest.fn(),
      clearData: jest.fn(),
      setDragImage: jest.fn(),
      addElement: jest.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Empty product or source./i)
      ).toBeInTheDocument();
    });
  });

  it("shows error modal for invalid file extension", async () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    const dropZone = screen.getByTestId("drop-zone");
    const mockDataTransfer = {
      files: [new File(["content"], "test.txt", { type: "text/plain" })],
      items: [],
      types: [],
      setData: jest.fn(),
      getData: jest.fn(),
      clearData: jest.fn(),
      setDragImage: jest.fn(),
      addElement: jest.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Invalid file extension./i)
      ).toBeInTheDocument();
    });
  });

  // it("shows error modal for invalid CSV data structure", async () => {
  //   render(<FileDrop selectedSubcategory={selectedSubcategory} selectedSource={selectedSource}/>)
  //   const dropZone =  screen.getByTestId("drop-zone");

  //   const mockDataTransfer = { files: [new File(["FeEdback,Date\nGood,12-31-24"], "test.csv", { type: "text/csv" })], items: [], types: [], setData: jest.fn(), getData: jest.fn(), clearData: jest.fn(), setDragImage: jest.fn(), addElement: jest.fn(), effectAllowed: "", dropEffect: "", };

  //   if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer});

  //   await waitFor(() => {
  //     expect(screen.getByText(/Error: Invalid data./i)).toBeInTheDocument();
  //   });
  // });

  it("uploads valid CSV file successfully", async () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    const dropZone = screen.getByTestId("drop-zone");

    const mockDataTransfer = {
      files: [
        new File(["FeEdback,Date \nGood,31-12-24"], "test.csv", {
          type: "text/csv",
        }),
      ],
      items: [],
      types: [],
      setData: jest.fn(),
      getData: jest.fn(),
      clearData: jest.fn(),
      setDragImage: jest.fn(),
      addElement: jest.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(screen.getByText(/Uploaded successfully/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          new RegExp(
            `${selectedSubcategory}__${selectedSource[0]}__test.csv`,
            "i"
          )
        )
      ).toBeInTheDocument();
    });
  });

  // it("shows error modal for invalid XLSX data structure", async () => {
  //   render(<FileDrop selectedSubcategory={selectedSubcategory} selectedSource={selectedSource}/>)
  //   const dropZone =  screen.getByTestId("drop-zone");

  //   const workbook = XLSX.utils.book_new();
  //   const worksheetData = [["FeEdback", "Date"], ["Good", "12-31-24"]];
  //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   const mockDataTransfer = { files: [new File([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })], items: [], types: [], setData: jest.fn(), getData: jest.fn(), clearData: jest.fn(), setDragImage: jest.fn(), addElement: jest.fn(), effectAllowed: "", dropEffect: "", };

  //   if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer});

  //   await waitFor(() => {
  //     expect(screen.getByText(/Error: Invalid data./i)).toBeInTheDocument();
  //   });
  // });

  it("uploads valid XLSX file successfully", async () => {
    render(
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    );
    const dropZone = screen.getByTestId("drop-zone");

    const workbook = XLSX.utils.book_new();
    // If valid date, Excel internally automatically converts to timestamp Eg. 45383 corresponds to 01-04-24
    const worksheetData = [
      ["FeEdback", "Date"],
      ["Good", 45383],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const mockDataTransfer = {
      files: [
        new File(
          [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
          "test.xlsx",
          {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        ),
      ],
      items: [],
      types: [],
      setData: jest.fn(),
      getData: jest.fn(),
      clearData: jest.fn(),
      setDragImage: jest.fn(),
      addElement: jest.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    if (dropZone) fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(screen.getByText(/Uploaded successfully/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          new RegExp(
            `${selectedSubcategory}__${selectedSource[0]}__test.xlsx`,
            "i"
          )
        )
      ).toBeInTheDocument();
    });
  });
});
