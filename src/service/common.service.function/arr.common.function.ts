import { commonFun } from "src/clsfunc/commonfunc";
import { Repository, MoreThan, LessThan } from 'typeorm';
import { ecg_csv_ecgdata_arrEntity } from "src/entity/ecg_csv_ecgdata_arr.entity";
import { UserCommonQuerycheckIDDupe } from "../user.commonQuery";
import { parentsEntity } from "src/entity/parents.entity";
import { UserEntity } from "src/entity/user.entity";

export const ArrWritetime = async (
    Repository: Repository<ecg_csv_ecgdata_arrEntity>,
    eq: string,
    startDate: string,
    endDate: string,
): Promise<string> => {

    try {
        let result;
        if (endDate != '') {
            result = await Repository
                .createQueryBuilder('ecg_csv_ecgdata_arr')
                .select('writetime,address')
                .where({ eq: eq })
                .andWhere({ writetime: MoreThan(startDate) })
                .andWhere({ writetime: LessThan(endDate) })
                .getRawMany();
        } else {
            result = await Repository
                .createQueryBuilder()
                .select('ecgpacket')
                .where({ eq: eq })
                .andWhere({ writetime: startDate })
                .getRawMany();
        }
        const Value =
            result.length != 0 && eq != null
                ? commonFun.converterJson(result)
                : 'result = 0';
        return Value;
    } catch (E) {
        console.log(E);
    }
}

export const CountArr = async (
    Repository: Repository<ecg_csv_ecgdata_arrEntity>,
    userRepository: Repository<UserEntity>,
    eq: string,
    startDate: string,
    endDate: string,
): Promise<string> => {
    try {
        let Value = await OnlyArrCount(Repository, eq, startDate, endDate);
        const info = await UserCommonQuerycheckIDDupe.getProfile(
            userRepository,
            parentsEntity,
            eq,
            true,
        );
        if (!Value.includes('result') && !info.includes('result')) {
            const arr = Value?.replace('{', '');
            const profile = info?.replace('}', ',');
            Value = profile + arr;
        }
        return Value;
    } catch (E) {
        console.log(E);
    }
}

export const OnlyArrCount = async (
    Repository: Repository<ecg_csv_ecgdata_arrEntity>,
    empid: string,
    startDate: string,
    endDate: string,
): Promise<string> => {
    try {
        console.log(empid, startDate, endDate);
        const result = await Repository
            .createQueryBuilder()
            .select('COUNT(*) as arrCnt')
            .where({ eq: empid })
            .andWhere({ writetime: MoreThan(startDate) })
            .andWhere({ writetime: LessThan(endDate) })
            .andWhere('address is null', { address: null })
            .getRawOne();
        console.log(result);
        let Value =
            result.length != 0 && empid != null
                ? commonFun.converterJson(result)
                : 'result = 0';
        return Value;
    } catch (E) {
        console.log(E);
        return 'result = 0';
    }
}

export const GraphArrCount = async (
    Repository: Repository<ecg_csv_ecgdata_arrEntity>,
    eq: string,
    startDate: string,
    endDate: string,
    len: number,
): Promise<string> => {
    try {
        const startLen = commonFun.getStartLen(len);
        console.log(`${startLen} -- ${len}`);
        const result = await Repository
            .createQueryBuilder('ecg_csv_ecgdata_arr')
            .select(`MID(writetime,${startLen},2) writetime,COUNT(ecgpacket) count`)
            .where({ eq: eq })
            .andWhere({ writetime: MoreThan(startDate) })
            .andWhere({ writetime: LessThan(endDate) })
            .groupBy(`MID(writetime,${startLen},2)`)
            .having('COUNT(ecgpacket)')
            .orderBy('writetime', 'ASC')
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