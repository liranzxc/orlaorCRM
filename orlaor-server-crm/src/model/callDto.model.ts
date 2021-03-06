import { Moment } from 'moment-timezone';

export interface CallDtoModel {
  _id: string;
  id?: string;
  name: string;
  callDate: string;
  type: string;
  duration: number;
  phoneId: string;
  number: string;
  hash: string;
  timestamp: number;
  hide?: boolean;
}

export interface TableRecordModel {
  name: string;
  number: string;
  lastCallInput: string;
  lastCallOutput: string;
  numberOfInputCalls: number;
  numberOfOutputCalls: number;
  status: string;
  redSignal: boolean;
  message1: string;
  messageWelcome: string;
}
