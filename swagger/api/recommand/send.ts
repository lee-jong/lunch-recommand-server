import { apiSchemas } from "swagger/handler/setting";
import { res } from "swagger/interface";
const schemas = apiSchemas({
  methods: "get",
  tag: "Recommand",
  description: "점심 추천 발송",
  requestBody: {},
  responses: {
    properties: {
      message: res.message,
    },
  },
});

export default {
  "/api/v1/recommand/send_recommand": schemas,
};
