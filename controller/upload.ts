import { Request, Response } from "express";
import { join } from "path";
import fs from "fs";
import csvParser from "csv-parser";
import iconv from "iconv-lite";
import { name_exception, address_exception } from "helper/upload";
import { handleError } from "util/status";

export const fileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw { code: 400, desc: "the file does not exist." };
    }

    await new Promise((_res, rej) => {
      let data: Array<RestaurantInfo> = [];
      fs.createReadStream(join(__dirname, "../uploads/Restaurant.csv"))
        .pipe(iconv.decodeStream("EUC-KR"))
        .pipe(csvParser())
        .on("data", (row) => {
          if (row["영업상태"] !== "운영") return;
          if (row["업종명"] !== "일반음식점") return;
          if (row["구"] !== "분당구") return;
          if (!row["소재지(지번)"].includes("야탑동")) return;
          if (
            name_exception.some((ex) =>
              row["사업장명"].toUpperCase().includes(ex.toUpperCase())
            )
          )
            return;
          if (
            address_exception.some((ex) => row["소재지(도로명)"].includes(ex))
          )
            return;
          data.push(row);
        })
        .on("end", () => {
          fs.writeFileSync(
            join(__dirname, "../json/restaurant.json"),
            JSON.stringify(data, null, 2)
          );
          console.log("CSV file successfully converted to JSON.");
        })
        .on("error", (err) => {
          rej({ code: 400, desc: "please check the format of the file." });
        });
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (e: any) {
    handleError(res, e.code, e.desc);
  }
};
