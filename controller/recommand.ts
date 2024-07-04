import { Request, Response } from "express";
import fs from "fs";
import { join } from "path";
import { sendJandiWebhook } from "api/jandi";
import { getKakaoSearch } from "api/kakao";
import { handleError } from "util/status";

export const sendRecommand = async (_req?: Request, res?: Response) => {
  try {
    const data: Array<RestaurantInfo> = JSON.parse(
      fs.readFileSync(join(__dirname, "../json/restaurant.json"), "utf-8")
    );

    const randomRestaurats = await new Promise<Array<RecommandRestaurantInfo>>(
      async (res, rej) => {
        try {
          let random: Array<RecommandRestaurantInfo> = [];
          for (let i = 0; i < 5; i++) {
            let randomNum = Math.floor(Math.random() * data.length);
            let pick = data[randomNum];

            if (!random.some((item) => item["사업장명"] == pick["사업장명"])) {
              const query = "야탑 " + pick["사업장명"];
              const searchData = await getKakaoSearch(query);
              random.push({
                ...pick,
                imageUrl: searchData.documents[0].url ?? "",
              });
            } else {
              i--;
            }
          }
          res(random);
        } catch (e) {
          rej({ code: 500 });
        }
      }
    );

    const info = {
      data: randomRestaurats,
      key: process.env.WEBHOOK_URL ?? "",
    };

    sendJandiWebhook(info);

    res &&
      res.status(200).json({
        status: 200,
        message: "OK",
      });
  } catch (e: any) {
    res && handleError(res, e.code, e.desc);
  }
};
