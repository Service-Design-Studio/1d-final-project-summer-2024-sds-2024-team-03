import { DragEvent, useState } from "react";

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
          selectedProduct[0] + "__" + selectedSource[0] + "__" + file.name; // Append "abc" to the original filename
        const newFile = new File([file], newFilename, { type: file.type }); // Create a new File object

        console.log("=> onloadend:");
        console.log("Filename:", file.name); // Print the filename
        console.log("File:", file); // Print the filename
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
        height: "50px",
        width: "300px",
        border: "1px dotted",
        backgroundColor: isOver ? "lightgray" : "white",
      }}
    >
      Drag and drop some files here
    </div>
  );
}
