import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_csv_ecgdataDTO } from '../dto/ecg_csv_ecgdata.dto';
import { ecg_csv_bpmdayService } from '../service/ecg_csv_bpmday.service';
import { Test_BpmService } from 'src/service/test.service/test.bpm.service';


@Controller('mslbpm')
@ApiTags('mslbpm')
export class ecg_csv_bpmdayController {
  constructor(private readonly ecg_csv_bpmdayService: ecg_csv_bpmdayService, private readonly test_bpmService: Test_BpmService) { }

  @Post("/api_data")
  async postAll(
    @Body() body: ecg_csv_ecgdataDTO): Promise<any> {
    return await this.ecg_csv_bpmdayService.gubunKind(body);
  }

  @Get("/api_getdata")
  async getBpm(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<string> {
    return await this.ecg_csv_bpmdayService.BpmData(eq, startDate, endDate);
  }


  // 사용중
  @Get("/webBpm")
  async getWebBpm(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<string> {
    switch (name) {
      case 'test':
        return await this.test_bpmService.getWebBpm(eq, startDate, endDate);
      default:
        return await this.ecg_csv_bpmdayService.getWebBpm(eq, startDate, endDate);
    }
  }


  // 사용중
  @Get("/webGraphBpmHrvArr")
  async getWebGraph(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_bpmService.webGraphBpmHrvArr(eq, startDate, endDate);
      default:
        return await this.ecg_csv_bpmdayService.webGraphBpmHrvArr(eq, startDate, endDate);
    }
  }

}