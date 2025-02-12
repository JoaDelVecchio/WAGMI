import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config";
import ConnectDB from "./config/data";

import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";

import authRouter from "./routes/authRoutes";
import portfolioRouter from "./routes/portfolioRoutes";
import tokenRouter from "./routes/tokenRoutes";

const app = express();

//Connect to MongoDB
ConnectDB();

//CORS POLICY
app.use(cors({ credentials: true }));

//Logger
app.use(logger);

//MIDDLEWARE PARSER
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/portfolio/tokens", tokenRouter);

//Error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
