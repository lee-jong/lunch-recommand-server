import { Request, Response, NextFunction } from "express";

const iterceptor = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default iterceptor;
