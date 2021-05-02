export const ENV = {
  MONGODB_USERNAME: 'xx',
  MONGODB_PASSWORD: 'xx',
  MONGODB_DB: `xx`,
  MONGODB_CLUSTER_NAME: 'xxxx',
  API_KEY: 'xxx',
};

export const MONGO_URL = `mongodb+srv://${ENV.MONGODB_USERNAME}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_CLUSTER_NAME}/${ENV.MONGODB_DB}?retryWrites=true&w=majority`;
