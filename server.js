const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

require("./config/mongo")();

const router = require("./routes/words");

app.use(cors());
app.use("/api/v1", router);

app.use(express.static("./audio-uploads"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port: ${PORT}; in env: ${process.env.NODE_ENV}`));