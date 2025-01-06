import { ecg_raw_history_lastEntity } from '../../entity/ecg_raw_history_last.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, MoreThan, In } from 'typeorm';
import { ecg_raw_history_lastDTO } from '../../dto/ecg_raw_history_last.dto';
import { commonFun, db } from '../../clsfunc/commonfunc';
import { ecg_csv_datadayEntity } from '../../entity/ecg_csv_dataday.entity';
import { ConfigService } from '@nestjs/config';
import { Gethistory_last } from '../common.service.function/last.common.function';


@Injectable()
export class Test_History_lastService {
    constructor(
        @InjectRepository(ecg_raw_history_lastEntity, db.test)
        private ecg_raw_history_lastRepository: Repository<ecg_raw_history_lastEntity>,
        @InjectRepository(ecg_csv_datadayEntity, db.test)
        private ecg_csv_datadayRepository: Repository<ecg_csv_datadayEntity>,
        private config: ConfigService,
    ) { }

    async gubunKind(body: ecg_raw_history_lastDTO): Promise<any> {
        switch (body.kind) {
            case 'getdata':
                return this.getEcg_raw_history_last(body.eq);
            case 'ecgSerialNumber':
                return await this.setEcgSerialNumber_update(body);
            case null:
                return false;
        }
    }

    async setEcgSerialNumber_update(body: ecg_raw_history_lastDTO): Promise<boolean> {
        try {
            const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
                .update(ecg_raw_history_lastEntity).set({ log: body.log })
                .where({ eq: body.eq })
                .execute()
            return result.affected > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getEcg_raw_history_last(empid: string): Promise<string> {
        try {
            const result: ecg_raw_history_lastEntity[] =
                await this.ecg_raw_history_lastRepository
                    .createQueryBuilder('ecg_raw_history_last')
                    .select('bpm')
                    .where({ eq: empid })
                    .getRawMany();

            console.log(`history 사용중 ${empid}`);
            const Value =
                result.length != 0 && empid != null
                    ? commonFun.convertCsv(commonFun.converterJson(result))
                    : 'result = 0';

            return Value;
        } catch (E) {
            console.log(E);
        }
    }

    async get_lastBpmTime(empid: string): Promise<string> {
        try {
            const result: ecg_raw_history_lastEntity =
                await this.ecg_raw_history_lastRepository
                    .createQueryBuilder('ecg_raw_history_last')
                    .select('bpm,temp,writetime')
                    .where({ eq: empid })
                    .getRawOne();
            const Value =
                result?.writetime != undefined && empid != null
                    ? commonFun.converterJson(result)
                    : 'result = 0';
            return Value;
        } catch (E) {
            console.log(E);
        }
    }

    async gethistory_last(eq: string): Promise<string> {
        return await Gethistory_last(this.ecg_raw_history_lastRepository, this.ecg_csv_datadayRepository, eq, this.config);
    }
}
