import React, {DragEvent, useState} from "react";
import {Box, Modal, Typography, Button} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {useTheme} from "@mui/material/styles";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface FileDropAttributes {
    selectedProduct: string[];
    selectedSource: string[];
}
export function FileDrop({
    selectedProduct,
    selectedSource,
}: FileDropAttributes) {
    const [isOver, setIsOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const requiredCols: string[] = ["date", "feedback"];
    const theme = useTheme();

    const validateDateFormat = (dates: string[]) => {
        return dates.every((date) => {
            // ✅01/04/2024 09:00:00 AM in xls
            let regex =
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}(?:.*)?$/;
            if (!regex.test(date)) {
                // ✅01-04-24  09:00:00 AM in csv
                regex =
                    /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{2}(?:.*)?$/;
                console.log(date);
            }
            return regex.test(date);
        });
    };

    const convertExcelTimestampToDate = (timestamp: number): string => {
        // 45383
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(
            excelEpoch.getTime() + timestamp * 24 * 60 * 60 * 1000
        );
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString().slice(-2);
        // 01-04-24
        const dateStr = `${day}-${month}-${year}`;
        return dateStr;
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Define the event handlers
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);

        // Fetch the files
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(droppedFiles);

        if (
            selectedProduct[0] === undefined ||
            selectedSource[0] === undefined
        ) {
            setModalContent("Error: Empty product or source.");
            setOpenModal(true);
        } else {
            // Use FileReader to read file content
            droppedFiles.forEach((file) => {
                processFile(file);
            });
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files
            ? Array.from(event.target.files)
            : [];
        setFiles(uploadedFiles);
        if (
            selectedProduct[0] === undefined ||
            selectedSource[0] === undefined
        ) {
            setModalContent("Error: Empty product or source.");
            setOpenModal(true);
        } else {
            uploadedFiles.forEach((file) => {
                processFile(file);
            });
        }
    };

    const processFile = (file: File) => {
        const ext = file.name.match(/\.([^\.]+)$/);
        if (ext && !["csv"].includes(ext[1]) && !/^xls/i.test(ext[1])) {
            setModalContent("Error: Invalid file extension.");
            setOpenModal(true);
        } else {
            const reader = new FileReader();

            reader.onloadend = () => {
                let isValid = false;

                if (ext && ext[1] === "csv") {
                    const csvData = reader.result as string;
                    const parsed = Papa.parse(csvData, {header: true});
                    let columns: string[] = [];
                    if (parsed.meta && parsed.meta.fields) {
                        columns = parsed.meta.fields.map((col: string) =>
                            col.trim().toLowerCase()
                        );
                        const columnsSet = new Set(columns);
                        let dateColumnName =
                            parsed.meta.fields.find(
                                (col: string) =>
                                    col.trim().toLowerCase() === "date"
                            ) || "";
                        isValid =
                            requiredCols.every((col) => columnsSet.has(col)) &&
                            validateDateFormat(
                                parsed.data.map(
                                    (obj: any) => obj[dateColumnName]
                                )
                            );
                    }

                    if (!isValid) {
                        setModalContent("Error: Invalid data.");
                        setOpenModal(true);
                        return;
                    }
                } else if (ext && ext[1].startsWith("xls")) {
                    const data = new Uint8Array(reader.result as ArrayBuffer);
                    const workbook = XLSX.read(data, {type: "array"});
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const sheetData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                    });
                    const columns = (sheetData[0] as string[]).map(
                        (col: string) => col.trim().toLowerCase()
                    );
                    const columnsSet = new Set(columns);
                    const transformedData = sheetData
                        .slice(1)
                        .map((row: any) => {
                            // Produces Eg. {feedback: ..., date: ...}
                            const obj: {[key: string]: string} = {};
                            row.forEach((val: string, idx: number) => {
                                obj[columns[idx]] = val;
                            });
                            return obj;
                        });
                    let dateColumnName =
                        columns.find(
                            (col) => col.trim().toLowerCase() === "date"
                        ) || "";
                    isValid =
                        requiredCols.every((col) => columnsSet.has(col)) &&
                        validateDateFormat(
                            transformedData.map((obj: any) =>
                                convertExcelTimestampToDate(obj[dateColumnName])
                            )
                        );

                    if (!isValid) {
                        setModalContent("Error: Invalid data.");
                        setOpenModal(true);
                        return;
                    }
                }

                if (isValid) {
                    const newFilename =
                        selectedProduct[0] +
                        "__" +
                        selectedSource[0] +
                        "__" +
                        file.name;
                    const newFile = new File([file], newFilename, {
                        type: file.type,
                    });

                    console.log("Filename:", file.name);
                    console.log("File:", file);
                    console.log(reader);
                    console.log(reader.result);

                    // Create FormData and append the file
                    const formData = new FormData();
                    const csrfMetaTag = document.querySelector(
                        'meta[name="csrf-token"]'
                    );

                    // Check if the csrfMetaTag is not null before accessing its attributes
                    const csrfToken = csrfMetaTag
                        ? csrfMetaTag.getAttribute("content")
                        : "";

                    formData.append("file", newFile);
                    console.log("X-CSRF-Token", csrfToken);
                    const urlPrefix =
                        process.env.NODE_ENV === "development"
                            ? "http://localhost:3000"
                            : "";

                    fetch(`${urlPrefix}/analytics/uploads`, {
                        method: "POST",
                        body: formData,
                        headers: csrfToken ? {"X-CSRF-Token": csrfToken} : {},
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json(); // or response.text() if the response is not JSON
                        })
                        .then((data) => {
                            console.log("Success:", data);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                    setModalContent("");
                    setOpenModal(true);
                }
            };
            reader.onerror = () => {
                console.error("There was an issue reading the file.");
            };

            // reader.readAsDataURL(file);
            if (ext && ext[1] === "csv") {
                reader.readAsText(file);
            } else if (ext && ext[1].startsWith("xls")) {
                reader.readAsArrayBuffer(file);
            }
        }
    };

    return (
        <div
            data-testid="drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "600px",
                width: "100%",
                borderRadius: 18,
                backgroundColor:
                    theme.palette.mode === "dark" ? "#222" : "#ccc",
                boxShadow: `inset 0 0 20px ${
                    theme.palette.mode === "dark" ? "#555" : "#aaa"
                }`,
            }}
        >
            <input
                type="file"
                id="fileInput"
                style={{display: "none"}}
                multiple
                onChange={handleFileSelect}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <CloudUploadIcon sx={{color: "gray", fontSize: "8rem"}} />
                <Typography sx={{fontSize: "1.4rem"}}>
                    Drag and drop CSV or XLS files here
                </Typography>
                <Typography sx={{m: 3, fontSize: "1.2rem", fontWeight: "bold"}}>
                    OR
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                    htmlFor="fileInput"
                    sx={{
                        borderRadius: 8,
                        fontSize: "1.1rem",
                        backgroundColor: "#8D1927",
                        padding: "0.5rem 2rem",
                        "&:hover": {
                            backgroundColor: "#444",
                        },
                    }}
                >
                    Select Files
                </Button>
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-content"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        p: 2,
                        bgcolor: "background.paper",
                        margin: "auto",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        position: "absolute",
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        {modalContent ? (
                            modalContent
                        ) : (
                            <>
                                Uploaded successfully:
                                {files.map((file, index) => (
                                    <React.Fragment key={index}>
                                        <br />
                                        {selectedProduct[0] +
                                            "__" +
                                            selectedSource[0] +
                                            "__" +
                                            file.name}
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </Typography>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
}
