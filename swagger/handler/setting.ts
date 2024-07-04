interface ApiSchemasProps {
  required?: boolean;
  type: string;
  description: string;
  example?: any;
  default?: any;
  items?: any;
  format?: any;
  properties?: any;
}

interface ApiSchemas {
  methods: "get" | "post" | "delete" | "put";
  tag: string;
  description: string;
  requestBody: {
    properties?: {
      [key: string]: ApiSchemasProps;
    };
  };
  responses: {
    properties?: {
      [key: string]: ApiSchemasProps;
    };
  };
}

export const openapi = "3.0.0";

export const info = {
  title: "lunch recommand API",
  version: process.env.version ?? "0.0.0",
  description: "",
};

export const tags = [
  {
    name: "Common",
    description: "",
  },
];

export const schemes = ["http", "https"];

export const securityDefinitions = {
  ApiKeyAuth: {
    type: "apiKey",
    name: "Authorization",
    in: "header",
  },
};

export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "apiKey",
    name: "Authorization",
    description: "인증 토큰 값을 넣어주세요.",
    in: "header",
  },
};

// swagger 해당 패스 경로를 기준으로 토큰을 담아서 보내줌
// /api < 전체 swagger에서 사용하는 API에 토큰을 보낼 수 있도록 처리
export const security = [{ bearerAuth: ["/api"] }];

export const produces = ["application/json"];

export const servers = [
  {
    url: `http://localhost:4000`,
  },
];

export const schemas = require("json/status-codes.json");

type ContentType = "application" | "multipart";
export const apiSchemas = (
  data: ApiSchemas,
  type: ContentType = "application"
) => {
  const { methods, tag, description, requestBody, responses } = data;
  let body = {};
  const contentTyps = {
    application: {
      "application/json": {
        schema: {
          type: "object",
          properties: requestBody.properties,
        },
      },
    },
    multipart: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: requestBody.properties,
        },
      },
    },
  };

  if (Object.keys(requestBody).length) {
    body = {
      content: {
        ...contentTyps[type],
      },
    };
  }
  return {
    [methods]: {
      tags: [tag],
      summary: description,
      requestBody: body,
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "number",
                    description: "응답 상태 코드",
                    example: 200,
                  },
                  ...responses.properties,
                },
              },
            },
          },
        },
      },
    },
  };
};
