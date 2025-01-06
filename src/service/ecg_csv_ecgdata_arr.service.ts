import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ecg_csv_ecgdataDTO } from '../dto/ecg_csv_ecgdata.dto';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_csv_ecgdata_arr.entity';
import { commonFun, db } from '../clsfunc/commonfunc';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { commonQuery } from '../clsfunc/commonQuery';
import { parentsEntity } from '../entity/parents.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entity/user.entity';
import { alarmController } from '../alarm/alarmController';
import { ecg_byteEntity } from '../entity/ecg_byte.entity';
import { ArrWritetime, CountArr, GraphArrCount, OnlyArrCount } from './common.service.function/arr.common.function';

@Injectable()
export class ecg_csv_ecgdata_arrService {
  constructor(
    @InjectRepository(ecg_csv_ecgdata_arrEntity, db.deploy)
    private ecg_csv_ecgdata_arrRepository: Repository<ecg_csv_ecgdata_arrEntity>,
    @InjectRepository(parentsEntity, db.deploy)
    private parentsRepository: Repository<parentsEntity>,
    @InjectRepository(UserEntity, db.deploy)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ecg_byteEntity, db.deploy)
    private ecg_byteRepository: Repository<ecg_byteEntity>,
    private configService: ConfigService,
  ) { }

  table = 'ecg_csv_ecgdata_arr';
  select = 'writetime,ecgpacket';
  testSel = 'idx,writetime,ecgpacket,address';

  async gubunKind(body: ecg_csv_ecgdataDTO): Promise<any> {
    switch (body.kind) {
      case 'arrEcgData':
        return this.arrEcgData(body.eq, body.startDate, body.endDate);
      case 'arrEcgInsert':
        return this.insertEcgPacket(body);
      case null:
        return `result = ${false}`;
    }
  }

  async insertEcgPacket(body: ecg_csv_ecgdataDTO): Promise<string> {
    try {
      const arrInsert = await this.setInsert(body);
      if (arrInsert) {
        const parentsArr = await alarmController.getSelToken(
          this.parentsRepository,
          body.eq,
        );
        await alarmController.callPushAlarm(
          parentsArr,
          body,
          this.configService,
        );
      }
      return `result =  ${arrInsert}`;
    } catch (E) {
      console.log(E);
      return E as string;
    }
  }

  async setInsert(body: ecg_csv_ecgdataDTO): Promise<boolean> {
    try {
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder()
        .insert()
        .into(ecg_csv_ecgdata_arrEntity)
        .values([
          {
            eq: body.eq,
            writetime: body.writetime,
            bodystate: body.bodystate,
            ecgpacket: body.ecgPacket,
            address: body.address,
          },
        ])
        .execute();
      console.log('arrinsert');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
    }
  }

  async arrEcgData(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    console.log('arrEcgData');
    try {
      const result = await commonQuery.whereIfResult(
        this.ecg_csv_ecgdata_arrRepository,
        this.table,
        this.select,
        empid,
        startDate,
        endDate,
      );
      const Value =
        result.length != 0 && empid != null
          ? commonFun.convertCsv(commonFun.converterJson(result))
          : 'result = 0';
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async onlyArrCount(
    eq: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    return await OnlyArrCount(this.ecg_csv_ecgdata_arrRepository, eq, startDate, endDate);
  }

  async countArr(
    eq: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    return await CountArr(this.ecg_csv_ecgdata_arrRepository, this.userRepository, eq, startDate, endDate);
  }

  async graphArrCount(
    eq: string,
    startDate: string,
    endDate: string,
    len: number,
  ): Promise<string> {
    return await GraphArrCount(this.ecg_csv_ecgdata_arrRepository, eq, startDate, endDate, len);
  }

  async arrWritetime(
    eq: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    return await ArrWritetime(this.ecg_csv_ecgdata_arrRepository, eq, startDate, endDate)
  }

  async testArr(
    idx: number,
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      let result;
      if (endDate != '') {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder('ecg_csv_ecgdata_arr')
          .select(this.testSel)
          .where({ idx: MoreThan(idx) })
          .andWhere({ eq: empid })
          .andWhere({ writetime: MoreThan(startDate) })
          .andWhere({ writetime: LessThan(endDate) })
          .getRawMany();
      } else {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder()
          .select(this.testSel)
          .where({ idx: MoreThan(idx) })
          .andWhere({ eq: empid })
          .andWhere({ writetime: LessThan(endDate) })
          .getRawMany();
      }
      const Value =
        result.length != 0 && empid != null
          ? commonFun.convertCsv(commonFun.converterJson(result))
          : 'result = 0';
      console.log(empid);
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async arrPreEcgData(eq: string, date: string): Promise<string> {
    try {
      const subQuery = await this.subQueryArr(eq, date);
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder('a')
        .select('b.ecgpacket ecg , a.ecgpacket arr')
        .leftJoin(
          subQuery,
          'b',
          'a.eq = b.eq AND b.writetime BETWEEN DATE_SUB(a.writetime,INTERVAL 4 SECOND) AND DATE_SUB(a.writetime,INTERVAL 2 SECOND)',
        )
        .where({ eq: eq })
        .andWhere({ writetime: date })
        .getRawMany();
      const Value =
        result.length != 0 && eq != null
          ? commonFun.converterJson(result)
          : 'result = 0';
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async subQueryArr(eq: string, writetime: string): Promise<string> {
    const subSelect = 'eq,writetime,ecgpacket';
    const onlyDate = writetime.split(' ')[0];
    try {
      const result = await this.ecg_byteRepository
        .createQueryBuilder()
        .subQuery()
        .select(subSelect)
        .from(ecg_byteEntity, '')
        .where(`eq = '${eq}'`)
        .andWhere(`writetime <= '${writetime}'`)
        .andWhere(`writetime >= '${onlyDate}'`)
        .orderBy('writetime', 'DESC')
        .limit(6)
        .getQuery();
      return result;
    } catch (E) {
      console.log(E);
    }
  }
}
