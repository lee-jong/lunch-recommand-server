import axios from "axios";
import { handleError, handleSuccess } from "../index";

const jandiInstance = axios.create({
  baseURL: "https://wh.jandi.com/connect-api/webhook",
  timeout: 3 * 1000,
});

export const sendJandiWebhook = async (info: {
  data: Array<RecommandRestaurantInfo>;
  key: string;
}) => {
  const connectInfo = info.data.map((item) => {
    return {
      title: item["사업장명"],
      imageUrl: item.imageUrl,
    };
  });

  const snedData = {
    body: "오늘의 점심 추천 음식점",
    connectColor: "#FAC11B",
    connectInfo: [
      ...connectInfo,
      {
        title: `업데이트 일자 ${info.data[0]["데이터기준일자"]}`,
      },
      {
        title: "점심 추천 API",
        imageUrl: `${process.env.SERVER_URL}/swagger`,
      },
    ],
  };
  await jandiInstance
    .post(info.key, snedData)
    .then(handleSuccess)
    .catch(handleError);
};
