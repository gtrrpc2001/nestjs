import { commonFun } from 'src/clsfunc/commonfunc';
import { ecg_byteEntity } from 'src/entity/ecg_byte.entity';
import { Repository, MoreThanOrEqual, LessThanOrEqual, MoreThan, LessThan } from 'typeorm';

export const GetEcg = async (Repository: Repository<ecg_byteEntity>, eq: string, startDate: string): Promise<number[]> => {
    try {
        const result = await Repository.createQueryBuilder('ecg_byte')
            .select('ecgpacket')
            .where({ "eq": eq })
            .andWhere({ "writetime": MoreThanOrEqual(startDate) })
            .getRawMany()
        const changeEcg: number[] = await getEcgChangeValue(result)
        const Value = (result.length != 0 && eq != null) ? changeEcg : [0]
        return Value;
    } catch (E) {
        console.log(E)
    }
}

export const GetEcgTime = async (Repository: Repository<ecg_byteEntity>, eq: string, startDate: string, endDate: string): Promise<string[]> => {
    try {
        const result = await Repository.createQueryBuilder('ecg_byte')
            .select('Mid(writetime,12,4) writetime')
            .where({ "eq": eq })
            .andWhere({ "writetime": MoreThanOrEqual(startDate) })
            .andWhere({ "writetime": LessThan(endDate) })
            .groupBy('Mid(writetime,12,4)')
            .getRawMany()
        return result;
    } catch (E) {
        console.log(E)
    }

}

export const GetGraphEcgValue = async (Repository: Repository<ecg_byteEntity>, eq: string, startDate: string, endDate: string): Promise<any> => {
    try {
        const result: ecg_byteEntity[] = await Repository.createQueryBuilder('ecg_byte')
            .select('ecgpacket,Mid(writetime,15,19) as writetime')
            .where({ "eq": eq })
            .andWhere({ "writetime": MoreThanOrEqual(startDate) })
            .andWhere({ "writetime": LessThanOrEqual(endDate) })
            .getRawMany()
        const changeEcg = await getGraphEcgChangeValue(result)
        return changeEcg;
    } catch (E) {
        console.log(E)
    }

}

const getEcgChangeValue = async (result: any[]): Promise<number[]> => {
    let ecgArr: number[] = []
    result.map(d => {
        const { ecgpacket } = d
        const ecg = commonFun.getEcgNumber(ecgpacket)
        ecg.map(d => {
            ecgArr.push(d)
        })
    });
    return ecgArr;
}

const getGraphEcgChangeValue = async (result: ecg_byteEntity[]): Promise<{ ecg: number[]; writetime: string; }[]> => {
    let ecgArr = result.map(d => {
        const { ecgpacket } = d
        const ecg = commonFun.getEcgNumber(ecgpacket)
        return { ecg: ecg, writetime: d.writetime }
    });
    return ecgArr;
}