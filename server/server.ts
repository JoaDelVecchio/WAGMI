import express from "express";
import cors from "cors";
import { PORT } from "./config";
import ConnectDB from "./config/data";

import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";

import authRouter from "./routes/authRoutes";

const app = express();

//Connect to MongoDB
ConnectDB();

//CORS POLICY
app.use(cors());

//Logger
app.use(logger);

//MIDDLEWARE PARSER
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);

//Error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
