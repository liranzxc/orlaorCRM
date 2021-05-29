"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URL = exports.ENV = void 0;
exports.ENV = {
    MONGODB_USERNAME: 'liran',
    MONGODB_PASSWORD: 'wIeCcYZwLJE0rUD6',
    MONGODB_DB: `CRM`,
    MONGODB_CLUSTER_NAME: 'orlaorcrm.usckw.mongodb.net',
    API_KEY: 'BBmy3dn7rtz4',
    EMAIL_AUTH_GMAIL: 'orlaor.aws@gmail.com',
    PASS_AUTH_GMAIL: 'Afeka2016',
    CLIENT_EMAIL: 'lirannh@gmail.com',
};
exports.MONGO_URL = `mongodb+srv://${exports.ENV.MONGODB_USERNAME}:${exports.ENV.MONGODB_PASSWORD}@${exports.ENV.MONGODB_CLUSTER_NAME}/${exports.ENV.MONGODB_DB}?retryWrites=true&w=majority`;
//# sourceMappingURL=env.js.map