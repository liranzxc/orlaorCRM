import { CallDtoModel } from './callDto.model';
export declare class CallEntity implements CallDtoModel {
    _id: string;
    callDate: string;
    duration: number;
    phoneId: string;
    hash: string;
    timestamp: number;
    name: string;
    number: string;
    type: string;
}
