import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { CallsModule } from './calls/calls.module';
import { MONGO_URL } from './env';

@Module({
  imports: [TypegooseModule.forRoot(MONGO_URL, {}), CallsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
