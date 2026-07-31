import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./app/config/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/routeNotFound";
import router from "./app/routes";
export const app: Application = express();

app.use(express.json());
app.use(cors({ origin: config.origin as string }));
app.use(cookieParser());
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Server");
});
app.use(globalErrorHandler);
app.use(notFound);
