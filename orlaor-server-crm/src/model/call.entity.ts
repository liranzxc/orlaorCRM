import { CallDtoModel } from './callDto.model';
import { IsNumber, IsString } from 'class-validator';
import { prop } from '@typegoose/typegoose';

export class CallEntity implements CallDtoModel {
  @IsString()
  @prop({ required: true })
  _id: string;

  @IsString()
  @prop({ required: true })
  callDate: string;

  @IsNumber()
  @prop({ required: false })
  duration: number;

  @IsString()
  @prop({ required: true })
  phoneId: string;

  @IsString()
  @prop({ required: true, unique: true })
  hash: string;

  @IsString()
  @prop({ required: false })
  name: string;

  @IsString()
  @prop({ required: true })
  number: string;

  @IsString()
  @prop({ required: true })
  type: string;
}
