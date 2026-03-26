const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartSplit backend running");
});

app.listen(5000, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:5000");
});