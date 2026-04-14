const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const loadEnv = require("./utils/loadEnv");
const connectDb = require("./database");
const routes = require("./routes/route");
const { errorHandler } = require("./middleware/errorHandler");

loadEnv();

try {
  require("./jobs/orderNotificationRetry");
} catch (error) {
  const isMissingOptionalJob =
    error.code === "MODULE_NOT_FOUND" &&
    error.message.includes("jobs/orderNotificationRetry");

  if (!isMissingOptionalJob) {
    throw error;
  }
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("JPM api is running ...");
});

app.use("/jpm", routes);
app.use("/", routes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();

    const PORT = process.env.PORT || 7000;
    const host = "localhost";

    server.listen(PORT, () => {
      console.log(`Server running at http://${host}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server.", error);
    process.exit(1);
  }
};

startServer();
