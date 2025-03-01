import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { ecg_csv_ecgdataDTO } from "src/dto/ecg_csv_ecgdata.dto";
import { ecg_csv_datadayEntity } from 'src/entity/ecg_csv_dataday.entity';
import { commonFun, db } from 'src/clsfunc/commonfunc';
import { commonQuery } from 'src/clsfunc/commonQuery';
import { changeType } from 'src/clsfunc/changeType';

import { GetWebSumDayData } from '../common.service.function/dayData.common.function';


@Injectable()
export class Test_DayDataService {
    constructor(@InjectRepository(ecg_csv_datadayEntity, db.test) private ecg_csv_datadayRepository: Repository<ecg_csv_datadayEntity>,
    ) { }

    table = 'ecg_csv_dataday'
    select = ''


    async gubunKind(body: ecg_csv_ecgdataDTO): Promise<any> {
        switch (body.kind) {
            case "calandDistanceData":
                this.select = 'eq,writetime,timezone,datayear,datamonth,dataday,datahour,step,distanceKM,cal,calexe,arrcnt'
                return await this.monthlyCalAndDistanceData(body.eq, body.startDate, body.endDate);
            case "calandInsert":
                return await this.insertDataDay(body);
            case null:
                return commonFun.converterJson('result = ' + false.toString());
        }
    }

    async insertDataDay(body: ecg_csv_ecgdataDTO): Promise<string> {
        var boolResult = false
        try {
            const month = changeType.getTimeChange(body.datamonth)
            const day = changeType.getTimeChange(body.dataday)
            const hour = changeType.getTimeChange(body.datahour)
            const writetime = `${body.datayear}-${month}-${day} ${hour}:00:00`
            console.log(writetime + `----${body.eq}`)
            const dataDayRaw: ecg_csv_datadayEntity[] = await this.getSelect(body, writetime)
            if (dataDayRaw.length != 0) {
                await this.setUpdate(body, writetime)
                console.log(body.eq + ' -- ' + 'update dataday')
            } else {
                await this.setInsert(body, writetime)
                console.log('insertDataDay')
            }

            boolResult = true
            var jsonValue = 'result = ' + boolResult.toString()
            return commonFun.converterJson(jsonValue);
        } catch (E) {
            console.log(E)
            return E;
        }

    }

    async getSelect(body: ecg_csv_ecgdataDTO, writetime: string): Promise<any> {
        const result = await this.ecg_csv_datadayRepository.createQueryBuilder(this.table)
            .select('eq')
            .where({ "eq": body.eq })
            .andWhere({ "writetime": writetime })
            .getRawMany()
        return result;
    }

    async setUpdate(body: ecg_csv_ecgdataDTO, writetime: string): Promise<any> {
        try {
            const result = await this.ecg_csv_datadayRepository.createQueryBuilder()
                .update(ecg_csv_datadayEntity)
                .set({
                    "step": body.step, "distanceKM": body.distanceKM, "cal": body.cal, "calexe": body.calexe,
                    "arrcnt": body.arrcnt
                })
                .where({ "eq": body.eq })
                .andWhere({ "writetime": writetime })
                .execute()
        } catch (E) {
            console.log(E)
        }
    }

    async setInsert(body: ecg_csv_ecgdataDTO, writetime: string): Promise<any> {
        try {
            const result = await this.ecg_csv_datadayRepository.createQueryBuilder()
                .insert()
                .into(ecg_csv_datadayEntity)
                .values([{
                    eq: body.eq, writetime: writetime, datayear: body.datayear, datamonth: body.datamonth, dataday: body.dataday,
                    datahour: body.datahour, timezone: body.ecgtimezone, step: body.step, distanceKM: body.distanceKM,
                    cal: body.cal, calexe: body.calexe, arrcnt: body.arrcnt
                }])
                .execute()
            return result;
        } catch (E) {
            console.log(E)
        }
    }

    async getDay(kind: string, empid: string, startDate: string, endDate: string): Promise<any> {
        switch (kind) {
            case "calandDistanceData":
                this.select = 'eq,writetime,timezone,datayear,datamonth,dataday,datahour,step,distanceKM,cal,calexe,arrcnt'
                return this.monthlyCalAndDistanceData(empid, startDate, endDate);
            case null:
                return commonFun.converterJson('result = ' + false.toString());
        }
    }

    async monthlyCalAndDistanceData(empid: string, startDate: string, endDate: string): Promise<string> {
        const result = await commonQuery.whereIfResult(this.ecg_csv_datadayRepository, this.table, this.select, empid, startDate, endDate);
        const Value = (result.length != 0 && empid != null) ? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
        return Value;
    }

    async getWebSumDayData(eq: string, startDate: string, endDate: string, len: number): Promise<string> {
        return await GetWebSumDayData(this.ecg_csv_datadayRepository, this.table, eq, startDate, endDate, len);
    }




}


