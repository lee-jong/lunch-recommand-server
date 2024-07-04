import { Express } from "express";
import upload from "./upload";
import recommand from "./recommand";

const route = (app: Express) => {
  app.use("/api/v1/file", upload);
  app.use("/api/v1/recommand", recommand);
};

export default route;
