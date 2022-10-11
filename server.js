import "express-async-errors";
import express from "express";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleWare from "./middleware/not-found.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const app = express();
// ! __dirname doesn't work in ES6 module hence this
const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
