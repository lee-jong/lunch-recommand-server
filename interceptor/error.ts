import { Request, Response, NextFunction } from "express";
import { handleStatus } from "../util/status";

const errorHandle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err).send(handleStatus(err));
};

export default errorHandle;
