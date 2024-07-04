import { apiSchemas } from "swagger/handler/setting";
import { res } from "swagger/interface";
const schemas = apiSchemas(
  {
    methods: "post",
    tag: "Upload",
    description:
      "공공데이터 기준 csv [https://www.data.go.kr/data/15076265/fileData.do]",
    requestBody: {
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The CSV file to upload",
        },
      },
    },
    responses: {
      properties: {
        message: res.message,
      },
    },
  },
  "multipart"
);

export default {
  "/api/v1/file/upload": schemas,
};
