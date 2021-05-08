export const ENV = {
  MONGODB_USERNAME: 'xx',
  MONGODB_PASSWORD: 'xxx',
  MONGODB_DB: `xxx`,
  MONGODB_CLUSTER_NAME: 'xxx',
  API_KEY: 'xxx',
  EMAIL_AUTH_GMAIL: 'xxx',
  PASS_AUTH_GMAIL: 'xx',
  CLIENT_EMAIL: 'xxx',
};

export const MONGO_URL = `mongodb+srv://${ENV.MONGODB_USERNAME}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_CLUSTER_NAME}/${ENV.MONGODB_DB}?retryWrites=true&w=majority`;
