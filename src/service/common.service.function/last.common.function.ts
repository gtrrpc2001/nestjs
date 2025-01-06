import { ConfigService } from "@nestjs/config";
import { commonFun } from "src/clsfunc/commonfunc";
import { ecg_csv_datadayEntity } from "src/entity/ecg_csv_dataday.entity";
import { ecg_raw_history_lastEntity } from "src/entity/ecg_raw_history_last.entity";
import { Repository } from 'typeorm';

export const Gethistory_last = async (Repository: Repository<ecg_raw_history_lastEntity>, dayRepository: Repository<ecg_csv_datadayEntity>, eq: string, config: ConfigService<Record<string, unknown>, false>): Promise<string> => {
    const select =
        'a.idx,a.eq,eqname,a.bpm,a.hrv,mid(a.temp,1,5) temp,' +
        'b.step step, b.distanceKM distanceKM, b.cal cal, b.calexe calexe, b.arrcnt arrcnt,a.timezone,' +
        'a.writetime,a.battery,a.log, ' +
        'case ' +
        "when MID(a.timezone,1,1) = '-' then DATE_ADD(a.writetime,INTERVAL cast(MID(a.timezone,2,2) AS unsigned) + 9 HOUR)" +
        " when MID(a.timezone,1,1) = '+' AND cast(MID(a.timezone,2,2) AS UNSIGNED) < 9 AND a.timezone NOT LIKE '%KR%' then DATE_ADD(a.writetime,INTERVAL 9 - cast(MID(a.timezone,2,2) AS unsigned) HOUR)" +
        " when MID(a.timezone,1,1) = '+' AND cast(MID(a.timezone,2,2) AS UNSIGNED) > 9 then DATE_SUB(a.writetime,INTERVAL 9 - cast(MID(a.timezone,2,2) AS UNSIGNED) HOUR)" +
        ' ELSE a.writetime END' +
        ' AS changeTime';
    try {
        const subQuery = await subQueryDataDay(dayRepository);
        let result;
        if (eq != config.get<string>('ID') && eq != String(config.get<string>('BUSINESS')) && eq != String(config.get<string>('BUSINESS2'))) {
            result = await Repository
                .createQueryBuilder('a')
                .select(select)
                .leftJoin(
                    subQuery,
                    'b',
                    'a.eq = b.eq AND Mid(a.writetime,1,10) = b.writetime',
                )
                .where({ eq: eq })
                .orderBy('changeTime', 'DESC')
                .getRawMany();
        } else if (eq == String(config.get<string>('BUSINESS'))) {
            // 요양병원 테스트용
            result = await Repository
                .createQueryBuilder('a')
                .select(select)
                .leftJoin(
                    subQuery,
                    'b',
                    'a.eq = b.eq AND Mid(a.writetime,1,10) = b.writetime',
                )
                .where({ isack: 1 })
                .orderBy('changeTime', 'DESC')
                .getRawMany();
        } else if (eq == String(config.get<string>('BUSINESS2'))) {
            // 요양병원 테스트용
            result = await Repository
                .createQueryBuilder('a')
                .select(select)
                .leftJoin(
                    subQuery,
                    'b',
                    'a.eq = b.eq AND Mid(a.writetime,1,10) = b.writetime',
                )
                .where({ isack: 2 })
                .orderBy('changeTime', 'DESC')
                .getRawMany();
        }
        else {
            result = await Repository
                .createQueryBuilder('a')
                .select(select)
                .leftJoin(
                    subQuery,
                    'b',
                    'a.eq = b.eq AND Mid(a.writetime,1,10) = b.writetime',
                )
                .orderBy('changeTime', 'DESC')
                .getRawMany();
        }

        const Value =
            result.length != 0
                ? commonFun.converterJson(result)
                : 'result = 0';

        return Value;
    } catch (E) {
        console.log(E);
    }
}

const subQueryDataDay = async (Repository: Repository<ecg_csv_datadayEntity>): Promise<string> => {
    const subSelect =
        'eq ,Mid(writetime,1,10) writetime,sum(step) step,sum(distanceKM) distanceKM,sum(cal) cal,sum(calexe) calexe,sum(arrcnt) arrcnt';
    try {
        const result = await Repository
            .createQueryBuilder()
            .subQuery()
            .select(subSelect)
            .from(ecg_csv_datadayEntity, '')
            .groupBy('eq,Mid(writetime,1,10)')
            .getQuery();

        return result;
    } catch (E) {
        console.log(E);
    }
}