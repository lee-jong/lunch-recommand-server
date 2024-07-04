import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import Swagger from "./handler/swagger";

import apiDoc from "./api";
export default class ApiDocs {
  $apiDocOption: any;
  $swagger: Swagger;

  constructor() {
    this.$apiDocOption = {
      ...apiDoc,
    };
    this.$swagger = new Swagger();
  }
  init() {
    this.$swagger.addAPI(this.$apiDocOption);
  }

  getSwaggerOption() {
    const { apiOption, setUpOption } = this.$swagger.getOption();

    const specs = swaggerJsDoc(apiOption);

    return {
      swaggerUI,
      specs,
      setUpOption,
    };
  }
}
