import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_byteDTO } from '../dto/ecg_byte.dto';
import { ecg_byteService } from '../service/ecg_byte.service';
import { Test_ecg_byteService } from 'src/service/test.service/test.ecg_byte.service';

@Controller('mslecgbyte')
@ApiTags('mslecg')
export class ecg_byteController {
  constructor(private readonly ecg_byteService: ecg_byteService, private readonly test_ecg_byteService: Test_ecg_byteService) { }

  @Post("/api_getdata")
  async postAll(
    @Body() body: ecg_byteDTO): Promise<any> {
    return await this.ecg_byteService.gubunKind(body);
  }

  @Get("/EcgIdx")
  async getEcgIdx(
    @Query('eq') eq: string,
    @Query('name') name?: string,
  ): Promise<number> {
    switch (name) {
      case 'test':
        return await this.test_ecg_byteService.getEcgIdx(eq)
      default:
        return await this.ecg_byteService.getEcgIdx(eq)
    }

  }

  @Get("/EcgTemp")
  async getEcgTemp(
    @Query('eq') eq: string,
    @Query('startIdx') startIdx: number,
    @Query('name') name?: string,
  ): Promise<{ idx: number, ecgpacket: number[] }[]> {
    switch (name) {
      case 'test':
        return await this.test_ecg_byteService.getEcgByIdx(eq, startIdx);
      default:
        return await this.ecg_byteService.getEcgByIdx(eq, startIdx);
    }
  }

  // 사용중
  @Get("/Ecg")
  async getEcg(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('name') name?: string,
  ): Promise<number[]> {
    switch (name) {
      case 'test':
        return await this.test_ecg_byteService.getEcg(eq, startDate);
      default:
        return await this.ecg_byteService.getEcg(eq, startDate);
    }
  }

  // 사용중
  @Get("/EcgTime")
  async getEcgTime(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<string[]> {
    switch (name) {
      case 'test':
        return await this.test_ecg_byteService.getEcgTime(eq, startDate, endDate);
      default:
        return await this.ecg_byteService.getEcgTime(eq, startDate, endDate);
    }
  }

  // 사용중
  @Get("/GraphEcg")
  async getGraphEcg(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name?: string,
  ): Promise<any> {
    switch (name) {
      case 'test':
        return await this.test_ecg_byteService.getGraphEcgValue(eq, startDate, endDate);
      default:
        return await this.ecg_byteService.getGraphEcgValue(eq, startDate, endDate);
    }
  }

}