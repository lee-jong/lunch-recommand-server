import express from "express";
import interceptor from "./interceptor/index";
import errorHandle from "./interceptor/error";
import helmet from "helmet";
import route from "route";
import cors from "cors";
import "dotenv/config";
import "lib/schedule";
import ApiDocs from "swagger";
import dotenv from "dotenv";

const res = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
process.env = {
  ...process.env,
  ...res.parsed,
};

const app = express();
const http = require("http").Server(app);
const port = process.env.SERVER_PORT ?? 4000;

const getSwaggerOption = () => {
  const apiDocs = new ApiDocs();
  apiDocs.init();
  return apiDocs.getSwaggerOption();
};
const { swaggerUI, specs, setUpOption } = getSwaggerOption();

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs, setUpOption));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(interceptor);
app.use(errorHandle);
route(app);

http.listen(port, () => {
  console.log(`connected at ${port}`);
});
