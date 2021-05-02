import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CallsController } from './calls.controller';
import { CallEntity } from '../model/call.entity';
import { CallsService } from './calls.service';

@Module({
  imports: [TypegooseModule.forFeature([CallEntity])],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
