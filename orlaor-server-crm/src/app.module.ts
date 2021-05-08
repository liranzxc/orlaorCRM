import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { CallsModule } from './calls/calls.module';
import { MONGO_URL } from './env';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypegooseModule.forRoot(MONGO_URL, {}),
    CallsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
