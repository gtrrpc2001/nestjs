import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_csv_ecgdataDTO } from '../dto/ecg_csv_ecgdata.dto';
import { ecg_csv_ecgdata_arrService } from '../service/ecg_csv_ecgdata_arr.service';
import { Test_ArrService } from 'src/service/test.service/test.arr.service';

@Controller('mslecgarr')
@ApiTags('mslecgarr')
export class ecg_csv_ecgdata_arrController {
  constructor(private readonly ecg_csv_ecgdata_arrService: ecg_csv_ecgdata_arrService, private readonly test_arrService: Test_ArrService) { }

  @Post("/api_getdata")
  async postAll(
    @Body() body: ecg_csv_ecgdataDTO): Promise<any> {
    return await this.ecg_csv_ecgdata_arrService.gubunKind(body);
  }

  @Get("/arrEcgData")
  async getArrEcgData(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string): Promise<string> {
    return await this.ecg_csv_ecgdata_arrService.arrEcgData(eq, startDate, endDate);
  }

  @Get("/arrPreEcgData")
  async getArrPreEcgData(
    @Query('eq') eq: string,
    @Query('date') date: string): Promise<any> {
    return await this.ecg_csv_ecgdata_arrService.arrPreEcgData(eq, date);
  }

  @Get("/test")
  async getTest(
    @Query('idx') idx: number,
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string): Promise<any> {
    return await this.ecg_csv_ecgdata_arrService.testArr(idx, eq, startDate, endDate);
  }

  // 사용중
  @Get("/arrWritetime")
  async getArrWritetime(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_arrService.arrWritetime(eq, startDate, endDate);
      default:
        return await this.ecg_csv_ecgdata_arrService.arrWritetime(eq, startDate, endDate);
    }
  }

  // 사용중
  @Get("/arrCnt")
  async getCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_arrService.countArr(eq, startDate, endDate);
      default:
        return await this.ecg_csv_ecgdata_arrService.countArr(eq, startDate, endDate);
    }

  }

  // 사용중
  @Get("/arrCount")
  async getOnlyCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_arrService.onlyArrCount(eq, startDate, endDate);
      default:
        return this.ecg_csv_ecgdata_arrService.onlyArrCount(eq, startDate, endDate);
    }

  }

  // 사용중
  @Get("/graphArrCnt")
  async getGraphArrCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('len') len: number,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_arrService.graphArrCount(eq, startDate, endDate, len);
      default:
        return await this.ecg_csv_ecgdata_arrService.graphArrCount(eq, startDate, endDate, len);
    }

  }


}