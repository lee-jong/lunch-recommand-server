import { Response } from "express";
export const handleStatus = (code: number | string, desc = "") => {
  const status = require("json/status-codes.json");
  try {
    status[code].message = desc;
    return status[code];
  } catch (e) {
    return status[500];
  }
};

export const handleError = (res: Response, e: any, desc = "") => {
  try {
    if (typeof e !== "number") {
      return res.status(500).json({ status: 500, message: e });
    }
    return res.status(e).json(handleStatus(e, desc));
  } catch (e) {
    return res.status(500).json({ status: 500, message: "server error" });
  }
};
