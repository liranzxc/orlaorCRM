import { CallDtoModel } from '../model/callDto.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CallEntity } from '../model/call.entity';
export declare class CallsService {
    private readonly repo;
    constructor(repo: ReturnModelType<typeof CallEntity>);
    handleCron(): Promise<void>;
    saveCallOnDb(calls: CallDtoModel[]): Promise<void>;
    private sendEmailReport;
    private createTable;
    private sendTableByEmail;
}
