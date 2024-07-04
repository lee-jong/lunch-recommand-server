import {
  openapi,
  info,
  servers,
  schemes,
  securityDefinitions,
  produces,
  securitySchemes,
  schemas,
  tags,
} from "./setting";

import { Options } from "swagger-jsdoc";

export default class Swagger {
  static $uniqueSwaggerInstance: any;
  $paths = [{}];
  $option: Options = {};
  $setUpOption: { explorer: boolean } = { explorer: true };

  /**
   *
   * @returns {Swagger}
   */
  constructor() {
    if (!Swagger.$uniqueSwaggerInstance) {
      this.$init();
      Swagger.$uniqueSwaggerInstance = this;
    }

    return Swagger.$uniqueSwaggerInstance;
  }

  $init() {
    this.$option = {
      definition: {
        openapi,
        info,
        servers,
        schemes,
        securityDefinitions,
        security: [{ bearerAuth: ["/api"] }],

        /* open api 3.0.0 version option */
        produces,
        components: {
          securitySchemes,
          schemas,
        },
        tags,
      },
      apis: [],
    };
  }

  addAPI(api: any) {
    this.$paths.push(api);
  }

  $processAPI() {
    const path: { [key: string]: unknown } = {};
    for (let i = 0; i < this.$paths.length; i += 1) {
      for (const [key, value] of Object.entries(this.$paths[i])) {
        path[key] = value;
      }
    }

    return path;
  }

  getOption() {
    const path = this.$processAPI();
    if (this.$option.definition) {
      this.$option.definition.paths = path;
    }

    return {
      apiOption: this.$option,
      setUpOption: this.$setUpOption,
    };
  }
}
