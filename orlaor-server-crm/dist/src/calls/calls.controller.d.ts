import { CallsService } from './calls.service';
export declare class CallsController {
    private readonly callService;
    constructor(callService: CallsService);
    getHello(): {
        message: string;
    };
    getCallData(body: any, apiKey: string): Promise<{
        ok: number;
    }>;
}
