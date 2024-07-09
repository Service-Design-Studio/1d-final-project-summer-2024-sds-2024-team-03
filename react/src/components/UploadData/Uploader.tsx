import React, { DragEvent, useState } from "react";
import { Box, Modal, Typography, Button } from '@mui/material';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileDropAttributes {
  selectedProduct: string[];
  selectedSource: string[];
}
export function FileDrop({
  selectedProduct,
  selectedSource,
}: FileDropAttributes) {
  console.log("Product:" + selectedProduct);
  console.log("Source:" + selectedSource);
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newFileName, setNewFilename] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
  }

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

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const newFilename =
          selectedProduct[0] + "__" + selectedSource[0] + "__" + file.name; 
        const newFile = new File([file], newFilename, { type: file.type }); 

        console.log("Filename:", file.name); 
        console.log("File:", file); // can use lastModified to see if same file / uploaded alr
        console.log(reader);
        console.log(reader.result);

        // Create FormData and append the file
        const formData = new FormData();
        const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');

        // Check if the csrfMetaTag is not null before accessing its attributes
        const csrfToken = csrfMetaTag
          ? csrfMetaTag.getAttribute("content")
          : "";

        formData.append("file", newFile);
        console.log("X-CSRF-Token", csrfToken);
        const urlPrefix =
          process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
        fetch(`${urlPrefix}/analytics/uploads`, {
          method: "POST",
          body: formData,
          headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
        })
          .then((response) => {
            if (!response.ok) {
            setOpenModal(true);
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
      };

      reader.onerror = () => {
        console.error("There was an issue reading the file.");
      };

      reader.readAsDataURL(file);
      return reader;
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "600px",
        width: "100%",
        border: "1px dotted",
        backgroundColor: isOver ? "gray" : "lightgray",
      }}
    >
      <CloudUploadIcon sx={{ color: 'grey'}} fontSize="large" />
      Drag and drop .csv/.xls files here
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ p: 2, bgcolor: 'background.paper', margin: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Uploaded successfully:{files.map((file, index) => (
              <React.Fragment key={index}>
                <br /> 
                {selectedProduct[0] + "__" + selectedSource[0] + "__" + file.name}
              </React.Fragment>
            ))}
          </Typography>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
