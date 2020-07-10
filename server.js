const express = require("express");
const app = express();
const cors = require("cors");
const error = require("./middleware/error");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

require("./config/mongo")();

const router = require("./routes/words");

app.use(cors());
app.use("/api/v1", router);
app.use(error);

app.use(express.static("./audio-uploads"));

//Use React build
app.use(express.static("./client/build"));

app.get("*", (req, res) => res.sendFile(path.resolve("./client/build/index.html")));
//

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port: ${PORT}; in env: ${process.env.NODE_ENV}`));
