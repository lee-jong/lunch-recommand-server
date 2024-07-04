import { join } from "path";
import fs from "fs";
export const changeJsonFile = (type: "name" | "addr", exception: string) => {
  try {
    const options = {
      name: {
        key: "사업장명" as RestaurantKey,
        fileName: "name_exception",
      },
      addr: {
        key: "소재지(도로명)" as RestaurantKey,
        fileName: "address_exception",
      },
    };

    const key = options[type].key;
    const fileName = options[type].fileName;
    // 상호명 제외 후 다시 저장
    const restaurantData: Array<RecommandRestaurantInfo> = require("json/restaurant.json");
    const exceptionData: Array<string> = require(`json/${fileName}.json`);

    exceptionData.push(exception);

    fs.writeFileSync(
      join(__dirname, `../json/${fileName}.json`),
      JSON.stringify(exceptionData, null, 2)
    );

    // 추천 리스트 제외 후 다시 저장
    fs.writeFileSync(
      join(__dirname, "../json/restaurant.json"),
      JSON.stringify(
        restaurantData.filter((item) => !item[key].includes(exception)),
        null,
        2
      )
    );
  } catch (e) {
    console.log("Error changing file", e);
    throw { code: 500, desc: "Error changing file" };
  }
};
