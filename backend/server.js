const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require('./routers');

// Init 1. for MongoDb connection
const dotenv = require('dotenv');
dotenv.config();
require('./config/db');
// End 1.

const app = express();
app.use(cors());
app.use(express.json());


// Routing services
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
