import { Request, Response } from "express";
import fs from "fs";
import { join } from "path";
import { sendJandiWebhook } from "api/jandi";
import { getKakaoSearch } from "api/kakao";
import { handleError } from "util/status";

const INDEX_PATH = join(__dirname, "../json/recommand_index.json");

const readIndex = (): number => {
  try {
    return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")).index ?? 0;
  } catch {
    return 0;
  }
};

const writeIndex = (index: number): void => {
  fs.writeFileSync(INDEX_PATH, JSON.stringify({ index }, null, 2));
};

export const sendRecommand = async (_req?: Request, res?: Response) => {
  try {
    const data: Array<RestaurantInfo> = JSON.parse(
      fs.readFileSync(join(__dirname, "../json/restaurant.json"), "utf-8"),
    );

    const currentIndex = readIndex();
    const pick = data[currentIndex];

    const query = "여수동" + pick["사업장명"];
    const searchData = await getKakaoSearch(query).catch((e) => {
      console.log("KAKAO ERROR", e);
      return "";
    });

    const restaurant: RecommandRestaurantInfo = {
      ...pick,
      imageUrl: searchData?.documents?.[0]?.url ?? "",
    };

    const info = {
      data: [restaurant],
      key: process.env.WEBHOOK_URL ?? "",
    };

    await sendJandiWebhook(info);

    writeIndex((currentIndex + 1) % data.length);

    res &&
      res.status(200).json({
        message: "OK",
      });
  } catch (e: any) {
    console.log("Recommand Error", e);
    res && handleError(res, e.code, e.desc);
  }
};
