import * as  express from "express";
import { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { DBSource } from "./clients/PostgresDB/data-source.client";

import * as swaggerUi from "swagger-ui-express";
import { CONFIG_VARS } from "./common/configs/config";
import scheduleRouter from "./schedule/schedule.router";
import activityRouter from "./activity/activity.router";
import authRouter from "./auth/auth.router";
import { swaggerDocs } from "./common/configs/swagger.config";

dotenv.config();

DBSource.initialize().then(() => {
  console.log("Database connected successfully");
});

export const app: Express = express();
app.use(express.json());

const port = CONFIG_VARS.PORT;

/*app.use(isAuthenticateJWT);
app.use(UnathorizedErrorResponse);
*/
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send("TEST PARA OUTBUILD");
});

app.use("/api/schedule", scheduleRouter);
app.use("/api", activityRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at  http://localhost:${port}`);
});
