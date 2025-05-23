const express = require("express");
const cors = require("cors");

// Init 1. for MongoDb connection
const dotenv = require('dotenv');
dotenv.config();
require('./models/db');
// End 1.

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
