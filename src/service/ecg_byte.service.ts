import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, MoreThan, LessThan } from 'typeorm';
import { commonFun, db } from "src/clsfunc/commonfunc";
import { ecg_byteEntity } from 'src/entity/ecg_byte.entity';
import { ecg_byteDTO } from 'src/dto/ecg_byte.dto';
import { ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { GetEcg, GetEcgTime, GetGraphEcgValue } from './common.service.function/ecgbyte.common.function';

@Injectable()
export class ecg_byteService {
  constructor(
    @InjectRepository(ecg_byteEntity, db.deploy) private ecg_byteRepository: Repository<ecg_byteEntity>,
    @InjectRepository(ecg_raw_history_lastEntity, db.deploy) private ecg_raw_history_lastRepository: Repository<ecg_raw_history_lastEntity>
  ) { }

  table = 'ecg_csv_ecgdata'
  select = 'eq,writetime,bpm,ecgpacket'

  async gubunKind(body: ecg_byteDTO): Promise<any> {
    switch (body.kind) {
      case "ecgByteInsert":
        return this.insertEcgPacket(body);
      case null:
        return commonFun.converterJson('result = ' + false.toString());
    }
  }

  async insertEcgPacket(body: ecg_byteDTO): Promise<string> {
    var boolResult = false
    try {
      // console.log(body.ecgPacket)
      const result = await this.setInsert(body)

      if (result) {
        boolResult = await this.updateLast(body)
      }
      console.log('ecgByteinsert')
      var jsonValue = 'result = ' + boolResult.toString()
      return commonFun.converterJson(jsonValue);
    } catch (E) {
      //console.log(E) 
      return E;
    }
  }

  async updateLast(body: ecg_byteDTO): Promise<boolean> {
    try {
      const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
        .update(ecg_raw_history_lastEntity)
        .set({ "writetime": body.writetime, "bpm": body.bpm })
        .where({ "eq": body.eq })
        .execute()
      console.log('updateLast')
      return true;
    } catch (E) {
      //console.log(E) 대기열 문제 가끔 발생
      return false;
    }
  }

  async setInsert(body: ecg_byteDTO): Promise<boolean> {
    try {
      const buffer = commonFun.getEcgBuffer(body.ecgPacket);
      // ecgpacket:() => `HEX(AES_ENCRYPT('${body.ecgPacket}','${key}'))`
      const result = await this.ecg_byteRepository.createQueryBuilder()
        .insert()
        .into(ecg_byteEntity)
        .values([{
          eq: body.eq, writetime: body.writetime, timezone: body.timezone, bpm: body.bpm,
          ecgpacket: buffer
        }])
        .execute()
      return true
    } catch (E) {
      console.log(E)
      return false
    }
  }

  async getEcg(eq: string, startDate: string): Promise<number[]> {
    return await GetEcg(this.ecg_byteRepository, eq, startDate)
  }

  async getEcgTime(eq: string, startDate: string, endDate: string): Promise<string[]> {
    return await GetEcgTime(this.ecg_byteRepository, eq, startDate, endDate)
  }

  async getGraphEcgValue(eq: string, startDate: string, endDate: string): Promise<any> {
    return await GetGraphEcgValue(this.ecg_byteRepository, eq, startDate, endDate);
  }
}


