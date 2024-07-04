import { apiSchemas } from "swagger/handler/setting";
import { res } from "swagger/interface";
const schemas = apiSchemas({
  methods: "post",
  tag: "Upload",
  description: "상호명 제외 문구 추가",
  requestBody: {
    properties: {
      name: {
        required: true,
        type: "string",
        description: "제외 문구",
        example: "매화로",
      },
    },
  },
  responses: {
    properties: {
      message: res.message,
    },
  },
});

export default {
  "/api/v1/file/name-exception": schemas,
};
