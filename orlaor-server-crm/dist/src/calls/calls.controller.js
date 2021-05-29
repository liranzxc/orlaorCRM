"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallsController = void 0;
const common_1 = require("@nestjs/common");
const calls_service_1 = require("./calls.service");
const env_1 = require("../env");
let CallsController = class CallsController {
    constructor(callService) {
        this.callService = callService;
    }
    getHello() {
        return { message: 'welcome' };
    }
    async getCallData(body, apiKey) {
        var _a;
        console.log('on controller', body, apiKey);
        if (((_a = body === null || body === void 0 ? void 0 : body.calls) === null || _a === void 0 ? void 0 : _a.length) && apiKey === env_1.ENV.API_KEY) {
            const calls = body.calls;
            await this.callService.saveCallOnDb(calls);
        }
        return { ok: 200 };
    }
};
__decorate([
    common_1.Get('/calls'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], CallsController.prototype, "getHello", null);
__decorate([
    common_1.Post('/calls'),
    __param(0, common_1.Body()), __param(1, common_1.Query('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "getCallData", null);
CallsController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [calls_service_1.CallsService])
], CallsController);
exports.CallsController = CallsController;
//# sourceMappingURL=calls.controller.js.map