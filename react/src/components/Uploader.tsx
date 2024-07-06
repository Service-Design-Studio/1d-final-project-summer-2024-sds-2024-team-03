import { DragEvent, useState } from "react";

export function FileDrop() {
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

        formData.append("file", file);
        console.log("X-CSRF-Token", csrfToken);

        fetch("http://localhost:3000/analytics/uploads", {
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
