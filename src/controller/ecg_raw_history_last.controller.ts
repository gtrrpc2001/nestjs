import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_raw_history_lastService } from '../service/ecg_raw_history_last.service';
import { ecg_raw_history_lastDTO } from '../dto/ecg_raw_history_last.dto';
import { Test_History_lastService } from 'src/service/test.service/test.last.service';

@Controller('mslLast')
@ApiTags('mslLast')
export class ecg_raw_history_lastController {
  constructor(private readonly ecg_raw_history_lastService: ecg_raw_history_lastService, private readonly test_History_lastService: Test_History_lastService) { }

  @Post("/api_getdata")
  async postAll(
    @Body() body: ecg_raw_history_lastDTO): Promise<any> {
    return await this.ecg_raw_history_lastService.gubunKind(body);
  }

  @Get("/last")
  async getLast(
    @Query('eq') eq: string): Promise<string> {
    return await this.ecg_raw_history_lastService.getEcg_raw_history_last(eq);
  }

  @Get("/lastBpmTime")
  async getLastTime(
    @Query('eq') eq: string): Promise<string> {
    return await this.ecg_raw_history_lastService.get_lastBpmTime(eq);
  }

  // 사용중
  @Get("/webTable")
  async getTableListValue(
    @Query('eq') eq: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_History_lastService.gethistory_last(eq);
      default:
        return await this.ecg_raw_history_lastService.gethistory_last(eq);
    }
  }
}