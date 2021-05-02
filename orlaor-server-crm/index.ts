import lambdaRequestHandler from 'lambda-request-handler';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';

const getApp = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  return await lambdaRequestHandler.nestHandler(app);
};


const handler = lambdaRequestHandler.deferred(getApp);

module.exports = { handler };
