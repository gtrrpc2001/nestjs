import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_csv_datadayService } from '../service/ecg_csv_dataday.service';
import { ecg_csv_ecgdataDTO } from '../dto/ecg_csv_ecgdata.dto';
import { Test_DayDataService } from 'src/service/test.service/test.dayData.service';


@Controller('mslecgday')
@ApiTags('mslecgday')
export class ecg_csv_datadayController {
  constructor(private readonly ecg_csv_datadayService: ecg_csv_datadayService, private readonly test_DayDataService: Test_DayDataService) { }

  @Post("/api_getdata")
  async postAll(
    @Body() body: ecg_csv_ecgdataDTO): Promise<any> {
    return await this.ecg_csv_datadayService.gubunKind(body);
  }

  @Get("/day")
  async getMonthly(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string): Promise<string> {
    return await this.ecg_csv_datadayService.getDay('calandDistanceData', eq, startDate, endDate);
  }

  // 사용중
  @Get("/webDay")
  async getWebDayData(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('len') len: number,
    @Query('name') name?: string,
  ): Promise<string> {
    switch (name) {
      case 'test':
        return await this.test_DayDataService.getWebSumDayData(eq, startDate, endDate, len);
      default:
        return await this.ecg_csv_datadayService.getWebSumDayData(eq, startDate, endDate, len);
    }
  }

}