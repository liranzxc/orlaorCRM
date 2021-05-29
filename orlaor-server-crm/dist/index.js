"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_request_handler_1 = require("lambda-request-handler");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const getApp = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    return await lambda_request_handler_1.default.nestHandler(app);
};
const handler = lambda_request_handler_1.default.deferred(getApp);
module.exports = { handler };
//# sourceMappingURL=index.js.map