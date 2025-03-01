import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';
import { ecg_csv_ecgdataDTO } from "src/dto/ecg_csv_ecgdata.dto";
import { ecg_csv_bpmdayEntity } from 'src/entity/ecg_csv_bpmday.entity';
import { commonFun, db } from 'src/clsfunc/commonfunc';
import { commonQuery } from 'src/clsfunc/commonQuery';
import { ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { ecg_csv_ecgdata_arrEntity } from 'src/entity/ecg_csv_ecgdata_arr.entity';
import { GetWebBpm, WebGraphBpmHrvArr } from './common.service.function/bpm.common.function';

@Injectable()
export class ecg_csv_bpmdayService {
  ecg_raws: ecg_csv_bpmdayEntity[] = [];
  constructor(@InjectRepository(ecg_csv_bpmdayEntity, db.deploy) private ecg_csv_bpmdayRepository: Repository<ecg_csv_bpmdayEntity>,
    @InjectRepository(ecg_raw_history_lastEntity, db.deploy) private ecg_raw_history_lastRepository: Repository<ecg_raw_history_lastEntity>,
    @InjectRepository(ecg_csv_ecgdata_arrEntity, db.deploy) private ecg_csv_ecgdata_arrRepository: Repository<ecg_csv_ecgdata_arrEntity>
  ) { }

  table = 'ecg_csv_bpmday'
  select = 'idx,eq,writetime,timezone,bpm,temp,hrv'


  async gubunKind(body: ecg_csv_ecgdataDTO): Promise<any> {
    switch (body.kind) {
      case "BpmData":
        return this.BpmData(body.eq, body.startDate, body.endDate);
      case "BpmDataInsert":
        return this.InsertBpmData(body);
      case null:
        return commonFun.converterJson('result = ' + false.toString());
    }
  }

  async InsertBpmData(body: ecg_csv_ecgdataDTO): Promise<string> {
    var boolResult = false
    console.log(`InsertBpmData --- ${body.writetime}`)
    try {
      const result = await this.setInsert(body)
      console.log(body.ecgtimezone)
      if (result) {
        boolResult = await this.updateLast(body)
      }

      var jsonValue = 'result = ' + boolResult.toString()
      return commonFun.converterJson(jsonValue);
    } catch (E) {
      console.log(E)
      return E;
    }
  }

  async updateLast(body: ecg_csv_ecgdataDTO): Promise<boolean> {
    try {
      console.log(`${body.timezone}`)
      const timezone = body.timezone.includes('+') ? body.timezone : (body.timezone.includes('-') ? body.timezone : ('+' + body.timezone).trim())
      const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
        .update(ecg_raw_history_lastEntity)
        .set({
          "writetime": body.writetime, "hrv": body.hrv, "cal": body.cal, "calexe": body.calexe, "step": body.step,
          "distanceKM": body.distanceKM, "arrcnt": body.arrcnt, "temp": body.temp, "timezone": timezone, "battery": body.battery,
          "isack": body.isack, "log": body.log
        })
        .where({ "eq": body.eq })
        .execute()
      console.log('updateLast')
      return true;
    } catch (E) {
      console.log(E)
      return false;
    }
  }

  async setInsert(body: ecg_csv_ecgdataDTO): Promise<boolean> {
    try {
      const result = await this.ecg_csv_bpmdayRepository.createQueryBuilder()
        .insert()
        .into(ecg_csv_bpmdayEntity)
        .values([{
          eq: body.eq, timezone: body.timezone, writetime: body.writetime, bpm: body.bpm,
          temp: body.temp, hrv: body.hrv
        }])
        .execute()
      return true
    } catch (E) {
      console.log(E)
      return false
    }
  }

  async BpmData(empid: string, startDate: string, endDate: string): Promise<string> {
    console.log('BpmData')
    const result = await commonQuery.whereIfResult(this.ecg_csv_bpmdayRepository, this.table, this.select, empid, startDate, endDate);
    const Value = (result.length != 0 && empid != null) ? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
    return Value;
  }

  async getWebBpm(eq: string, startDate: string, endDate: string): Promise<string> {
    return await GetWebBpm(this.ecg_csv_bpmdayRepository, this.table, eq, startDate, endDate)
  }

  async webGraphBpmHrvArr(eq: string, startDate: string, endDate: string): Promise<string> {
    return await WebGraphBpmHrvArr(this.ecg_csv_bpmdayRepository, this.ecg_csv_ecgdata_arrRepository, eq, startDate, endDate);
  }

  async subQueryArr(eq: string, writetime: string, endDate: string): Promise<string> {
    const subSelect = 'COUNT(ecgpacket) count,writetime'
    try {
      const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder()
        .subQuery()
        .select(subSelect)
        .from(ecg_csv_ecgdata_arrEntity, '')
        .where(`eq = '${eq}'`)
        .andWhere(`writetime >= '${writetime}'`)
        .andWhere(`writetime < '${endDate}'`)
        .groupBy('writetime')
        .having('COUNT(ecgpacket)')
        .getQuery()
      return result
    } catch (E) {
      console.log(E)
    }
  }
}