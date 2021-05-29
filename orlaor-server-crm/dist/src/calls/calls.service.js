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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const _ = require("underscore");
const nunjucks = require("nunjucks");
const nodemailer = require("nodemailer");
const env_1 = require("../env");
const path = require("path");
const moment = require("moment-timezone");
let CallsService = class CallsService {
    constructor(repo) {
        this.repo = repo;
    }
    async handleCron() {
        await this.sendEmailReport();
    }
    async saveCallOnDb(calls) {
        var e_1, _a;
        console.log('calling to db');
        try {
            for (var calls_1 = __asyncValues(calls), calls_1_1; calls_1_1 = await calls_1.next(), !calls_1_1.done;) {
                const call = calls_1_1.value;
                const found = await this.repo.findOne({ hash: call.hash });
                if (!found) {
                    try {
                        const callEntity = new this.repo(call);
                        callEntity._id = call.id;
                        await callEntity.save();
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                else {
                    console.log('skip same hash');
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (calls_1_1 && !calls_1_1.done && (_a = calls_1.return)) await _a.call(calls_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    async sendEmailReport() {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const regexMatch = [/הדרכה/i, /לקוח/i, /קורס/i, /לייזר/i];
        const records = await this.repo.find({
            $and: [
                {
                    timestamp: {
                        $gte: lastWeek.getTime(),
                        $lt: new Date().getTime(),
                    },
                },
                {
                    $or: [
                        { name: { $in: regexMatch } },
                        { type: 'MISSED', name: { $exists: false } },
                    ],
                },
            ],
        });
        const groups = _.groupBy(records, (r) => r.number);
        await this.createTable(groups);
    }
    async createTable(groups) {
        var e_2, _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const table = [];
        try {
            for (var _l = __asyncValues(Object.keys(groups)), _m; _m = await _l.next(), !_m.done;) {
                const number = _m.value;
                const arrayCalls = groups[number];
                const numberOfCallOnThisWeekInput = (_b = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls.filter((call) => (call === null || call === void 0 ? void 0 : call.type) === 'INCOMING' || (call === null || call === void 0 ? void 0 : call.type) === 'MISSED')) === null || _b === void 0 ? void 0 : _b.length;
                const numberOfCallOnThisWeekOutput = (_c = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls.filter((call) => (call === null || call === void 0 ? void 0 : call.type) === 'OUTGOING')) === null || _c === void 0 ? void 0 : _c.length;
                const latestInputCall = (_e = (_d = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls.filter((call) => (call === null || call === void 0 ? void 0 : call.type) === 'INCOMING' || (call === null || call === void 0 ? void 0 : call.type) === 'MISSED')) === null || _d === void 0 ? void 0 : _d.sort((a, b) => ((a === null || a === void 0 ? void 0 : a.timestamp) > (b === null || b === void 0 ? void 0 : b.timestamp) ? 1 : -1))) === null || _e === void 0 ? void 0 : _e[0];
                let lastCallDateInput = '';
                if (latestInputCall === null || latestInputCall === void 0 ? void 0 : latestInputCall.timestamp) {
                    try {
                        lastCallDateInput =
                            moment
                                .tz(new Date(latestInputCall === null || latestInputCall === void 0 ? void 0 : latestInputCall.timestamp), 'Asia/Jerusalem')
                                .format('dddd, MMMM Do YYYY, h:mm:ss a') || '';
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                const latestOutCall = (_g = (_f = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls.filter((call) => call.type === 'OUTGOING')) === null || _f === void 0 ? void 0 : _f.sort((a, b) => ((a === null || a === void 0 ? void 0 : a.timestamp) > (b === null || b === void 0 ? void 0 : b.timestamp) ? 1 : -1))) === null || _g === void 0 ? void 0 : _g[0];
                let lastCallDateOutput = '';
                if (latestOutCall === null || latestOutCall === void 0 ? void 0 : latestOutCall.timestamp) {
                    try {
                        lastCallDateOutput =
                            moment
                                .tz(new Date(latestOutCall === null || latestOutCall === void 0 ? void 0 : latestOutCall.timestamp), 'Asia/Jerusalem')
                                .format('dddd, MMMM Do YYYY, h:mm:ss a') || '';
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                const beforeThreeDay = new Date();
                beforeThreeDay.setDate(beforeThreeDay.getDate() - 3);
                let redSignal = false;
                if (beforeThreeDay.getTime() > (latestOutCall === null || latestOutCall === void 0 ? void 0 : latestOutCall.timestamp) ||
                    beforeThreeDay.getTime() > (latestInputCall === null || latestInputCall === void 0 ? void 0 : latestInputCall.timestamp)) {
                    redSignal = true;
                }
                const status = ((_h = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls.filter((call) => (call === null || call === void 0 ? void 0 : call.type) === 'MISSED')) === null || _h === void 0 ? void 0 : _h.length) ===
                    arrayCalls.length
                    ? 'MISSED'
                    : '';
                const name = ((_j = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls[0]) === null || _j === void 0 ? void 0 : _j.name)
                    ? (_k = arrayCalls === null || arrayCalls === void 0 ? void 0 : arrayCalls[0]) === null || _k === void 0 ? void 0 : _k.name
                    : 'unknown';
                const message2 = `
שלום לך,
 נשמח לחזור אלייך ולמסור פרטים.
תוכלו להתרשם ממגוון  מכשירים וקורסים שלנו.

לשרותכם
אור לעור טכנולוגיות 
סוזי נחמן
054-4969106`;
                let message1 = `שלום ${name.split(' ')[0]} `;
                message1 += ' מה נשמע ? יש משהו שנוכל להתקדם בו ? ';
                const numberWhatsapp = number.startsWith('+')
                    ? number
                    : '+972' + number.slice(1);
                table.push({
                    name: name,
                    lastCallInput: lastCallDateInput,
                    lastCallOutput: lastCallDateOutput,
                    status: status,
                    number: number,
                    numberOfInputCalls: numberOfCallOnThisWeekInput,
                    numberOfOutputCalls: numberOfCallOnThisWeekOutput,
                    redSignal: redSignal,
                    message1: encodeURI(`https://wa.me/${numberWhatsapp}/?text=${message1}`),
                    messageWelcome: encodeURI(`https://wa.me/${numberWhatsapp}/?text=${message2}`),
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_m && !_m.done && (_a = _l.return)) await _a.call(_l);
            }
            finally { if (e_2) throw e_2.error; }
        }
        await this.sendTableByEmail(table);
    }
    async sendTableByEmail(table) {
        const html = await nunjucks.render(path.resolve(__dirname, '../assets/table-report/index.html'), {
            items: table,
        });
        const mailOptions = {
            from: env_1.ENV.EMAIL_AUTH_GMAIL,
            to: env_1.ENV.CLIENT_EMAIL,
            subject: 'report customers ' + new Date().toString(),
            html: html,
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env_1.ENV.EMAIL_AUTH_GMAIL,
                pass: env_1.ENV.PASS_AUTH_GMAIL,
            },
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
__decorate([
    schedule_1.Cron(schedule_1.CronExpression.EVERY_10_SECONDS, {
        name: 'notifications',
        timeZone: 'Asia/Jerusalem',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CallsService.prototype, "handleCron", null);
CallsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('CallEntity')),
    __metadata("design:paramtypes", [Object])
], CallsService);
exports.CallsService = CallsService;
//# sourceMappingURL=calls.service.js.map