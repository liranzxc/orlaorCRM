import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { CallDtoModel } from '../model/callDto.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CallEntity } from '../model/call.entity';
@Injectable()
export class CallsService {
  constructor(
    @InjectModel('CallEntity')
    private readonly repo: ReturnModelType<typeof CallEntity>,
  ) {}

  async saveCallOnDb(calls: CallDtoModel[]) {
    console.log('calling to db');
    for await (const call of calls) {
      const found = await this.repo.findOne({ hash: call.hash });
      if (!found) {
        const callEntity = new this.repo(call);
        callEntity._id = call.id;
        await callEntity.save();
      } else {
        console.log('skip same hash');
      }
    }
  }
}
