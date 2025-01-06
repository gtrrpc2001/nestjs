import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_stressService } from '../service/ecg_stress.service';
import { Test_stressService } from 'src/service/test.service/test.stress.service';

@Controller('mslecgstress')
@ApiTags('mslecgstress')
export class ecg_stressController {
  constructor(private readonly ecg_stressService: ecg_stressService, private readonly test_stressService: Test_stressService) { }

  // 사용중
  @Get("/ecgStressData")
  async getArrEcgData(
    @Query('eq') eq: string,
    @Query('startDate') sDate: string,
    @Query('endDate') eDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_stressService.getStressData(eq, sDate, eDate);
      default:
        return await this.ecg_stressService.getStressData(eq, sDate, eDate);
    }
  }
}