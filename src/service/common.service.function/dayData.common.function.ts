import { commonFun } from "src/clsfunc/commonfunc"
import { ecg_csv_datadayEntity } from "src/entity/ecg_csv_dataday.entity";
import { Repository, MoreThan, LessThan } from 'typeorm';

export const GetWebSumDayData = async (Repository: Repository<ecg_csv_datadayEntity>, table: string, eq: string, startDate: string, endDate: string, len: number): Promise<string> => {
    try {
        const startLen = commonFun.getStartLen(len)
        const select = `MID(writetime,${startLen},2) writetime, SUM(cal) cal,SUM(calexe) calexe,SUM(step) step,SUM(distanceKM) distanceKM`
        const result = await Repository.createQueryBuilder(table)
            .select(select)
            .where({ 'eq': eq })
            .andWhere({ 'writetime': MoreThan(startDate) })
            .andWhere({ 'writetime': LessThan(endDate) })
            .groupBy(`MID(writetime,${startLen},2)`)
            .orderBy('writetime', 'ASC')
            .getRawMany()
        const Value = (result.length != 0 && eq != null) ? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')
        return Value;
    } catch (E) {
        console.log(E)
    }
}