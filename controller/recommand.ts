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

    const randomRestaurants = await new Promise<Array<RecommandRestaurantInfo>>(
      async (res, rej) => {
        try {
          let randomSet = new Set<number>();
          let random: Array<RecommandRestaurantInfo> = [];

          while (randomSet.size < 5) {
            const randomNum = Math.floor(Math.random() * data.length);
            if (!randomSet.has(randomNum)) {
              const pick = data[randomNum];
              const query = "야탑 " + pick["사업장명"];
              const searchData = await getKakaoSearch(query).catch((e) => {
                console.log("KAKAO ERROR", e);
                return "";
              });
              random.push({
                ...pick,
                imageUrl: searchData?.documents?.[0]?.url ?? "",
              });
              randomSet.add(randomNum);
            }
          }
          res(random);
        } catch (e) {
          rej({ code: 500 });
        }
      }
    );

    const info = {
      data: randomRestaurants,
      key: process.env.WEBHOOK_URL ?? "",
    };

    sendJandiWebhook(info);

    res &&
      res.status(200).json({
        message: "OK",
      });
  } catch (e: any) {
    console.log("Recommand Error", e);
    res && handleError(res, e.code, e.desc);
  }
};
