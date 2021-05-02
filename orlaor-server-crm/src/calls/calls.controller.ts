import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallDtoModel } from '../model/callDto.model';
import { ENV } from '../env';

@Controller()
export class CallsController {
  constructor(private readonly callService: CallsService) {}

  @Get('/calls')
  getHello(): { message: string } {
    return { message: 'welcome' };
  }

  @Post('/calls')
  async getCallData(@Body() body, @Query('apiKey') apiKey: string) {
    console.log('on controller', body, apiKey);
    if (body?.calls?.length && apiKey === ENV.API_KEY) {
      const calls = body.calls as CallDtoModel[];
      await this.callService.saveCallOnDb(calls);
    }
    return { ok: 200 };
  }
}
