import { Request, Response } from "express";
import fs from "fs";
import { join } from "path";
import { sendJandiWebhook } from "api/jandi";
import { getKakaoSearch } from "api/kakao";
import { handleError } from "util/status";

const INDEX_PATH = join(__dirname, "../json/recommand_index.json");

const readIndex = (key: string): number => {
  try {
    return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"))[key].index ?? 0;
  } catch {
    return 0;
  }
};

const writeIndex = (key: string, index: number): void => {
  let existing: Record<string, { key: string; index: number }> = {};
  try {
    const parsed = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      existing = parsed;
    }
  } catch {
    // 파일 없음 또는 손상 시 빈 객체로 시작
  }
  fs.writeFileSync(
    INDEX_PATH,
    JSON.stringify({ ...existing, [key]: { key, index } }, null, 2)
  );
};

export const multiRecommand = async (_req?: Request, res?: Response) => {
  try {
    const keys = ["RADTEAM", "1"];
    await Promise.all(keys.map((key) => sendRecommand(key)));

    res &&
      res.status(200).json({
        message: "OK",
      });
  } catch (e: any) {
    console.log("Recommand Error", e);
    res && handleError(res, e.code, e.desc);
  }
};

export const sendRecommand = async (key: string) => {
  try {
    const data: Array<RestaurantInfo> = JSON.parse(
      fs.readFileSync(join(__dirname, "../json/restaurant.json"), "utf-8")
    );

    let currentIndex = readIndex(key);
    const pick = data[currentIndex];

    if (!pick) {
      currentIndex = 0;
    }

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
      key: process.env[`WEBHOOK_URL_${key}`] ?? "",
    };

    await sendJandiWebhook(info);

    writeIndex(key, (currentIndex + 1) % data.length);
  } catch (e: any) {
    console.log("Recommand Error", e);
  }
};
