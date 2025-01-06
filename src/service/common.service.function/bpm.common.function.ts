import { commonFun } from 'src/clsfunc/commonfunc';
import { ecg_csv_bpmdayEntity } from 'src/entity/ecg_csv_bpmday.entity';
import { ecg_csv_ecgdata_arrEntity } from 'src/entity/ecg_csv_ecgdata_arr.entity';
import { Repository, MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';

export const GetWebBpm = async (Repository: Repository<ecg_csv_bpmdayEntity>, table: string, eq: string, startDate: string, endDate: string): Promise<string> => {
    try {
        const select = 'bpm,hrv,writetime'
        const result = await Repository.createQueryBuilder(table)
            .select(select)
            .where({ "eq": eq })
            .andWhere({ 'writetime': MoreThan(startDate) })
            .andWhere({ 'writetime': LessThan(endDate) })
            .orderBy('MID(writetime,12,8)', 'ASC')
            .getRawMany()
        return commonFun.converterJson(result)
    } catch (E) {
        console.log(E)
    }
}

export const WebGraphBpmHrvArr = async (Repository: Repository<ecg_csv_bpmdayEntity>, arrRepository: Repository<ecg_csv_ecgdata_arrEntity>, eq: string, startDate: string, endDate: string): Promise<string> => {
    try {
        const subQuery = await subQueryArr(arrRepository, eq, startDate, endDate)
        const result = await Repository.createQueryBuilder('a')
            .select('a.writetime,a.bpm,a.hrv,b.count')
            .leftJoin(subQuery, 'b', 'MID(a.writetime,1,18) = MID(b.writetime,1,18)')
            .where({ "eq": eq })
            .andWhere({ "writetime": MoreThanOrEqual(startDate) })
            .andWhere({ "writetime": LessThan(endDate) })
            .orderBy('writetime', 'ASC')
            .getRawMany()
        return commonFun.converterJson(result);
    } catch (E) {
        console.log(E)
    }
}

const subQueryArr = async (arrRepository: Repository<ecg_csv_ecgdata_arrEntity>, eq: string, writetime: string, endDate: string): Promise<string> => {
    const subSelect = 'COUNT(ecgpacket) count,writetime'
    try {
        const result = await arrRepository.createQueryBuilder()
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