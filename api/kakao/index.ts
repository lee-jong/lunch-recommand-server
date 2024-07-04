import axios from "axios";
import { handleError, handleSuccess } from "../index";

const kakaoSearchInstance = axios.create({
  baseURL: "https://dapi.kakao.com/v2/search",
  timeout: 3 * 1000,
});

export const getKakaoSearch = async (query: string) => {
  return await kakaoSearchInstance
    .get(`/blog?size=1&query=${query}`, {
      headers: { Authorization: process.env.KAKAO_API_KEY },
    })
    .then(handleSuccess)
    .catch(handleError);
};
