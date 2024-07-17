// ENTRY POINT OF GCLOUD FUNCTION
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

exports.jbaaamSite = app;
