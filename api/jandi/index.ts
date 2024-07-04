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
