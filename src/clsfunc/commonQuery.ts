import { parentsEntity } from 'src/entity/parents.entity';
import { MoreThanOrEqual,LessThan,LessThanOrEqual } from 'typeorm';
import { commonFun } from './commonfunc';

export class commonQuery{
    static async whereIfResult(Repository:any,table:string,select:string,empid:string,startDate:string,endDate:string): Promise<any>{
        var result: any        
        if(startDate == "" && endDate == ""){
            result = await Repository.createQueryBuilder(table)
            .select(select)    
            .where({"eq":empid})            
            .getRawMany()
        }else if(endDate == ""){        
            result = await Repository.createQueryBuilder(table)
            .select(select)    
            .where({"eq":empid}).andWhere({"writetime":MoreThanOrEqual(startDate)})
            .getRawMany()
        }else if(startDate == ""){
            result = await Repository.createQueryBuilder(table)
            .select(select)    
            .where({"eq":empid}).andWhere({"writetime":LessThan(endDate)})
            .getRawMany()
        }else{                        
            result = await Repository.createQueryBuilder(table)
            .select(select)            
            .where({"eq":empid}).andWhere({"writetime":MoreThanOrEqual(startDate)}).andWhere({"writetime":LessThan(endDate)})
            .getRawMany()
        }
        return result;
    }

    static async getProfile(Repository:any,parentsEntity:any,empid:string):Promise<string>{
        let boolResult = false
        try{
            let select = 'a.아이디,a.성명,a.이메일,a.핸드폰,a.성별,a.신장,a.몸무게,a.나이,a.생년월일,a.가입일,'+
            'a.설정_수면시작,a.설정_수면종료,a.설정_활동BPM,a.설정_일걸음,a.설정_일거리,a.설정_일활동칼로리,' +
            'a.설정_일칼로리,a.알림_sms,a.시간차이,b.phone'
            let result
            if(bool){
                result = await Repository.createQueryBuilder('a')        
                .select(select)    
                .leftJoin(parentsEntity,'b','a.아이디 = b.eq')    
                .where({"아이디":empid})    
                .getRawOne()    
            }else{
                result = await Repository.createQueryBuilder('a')        
                .select(select)    
                .leftJoin(parentsEntity,'b','a.아이디 = b.eq')    
                .where({"아이디":empid})    
                .getRawMany()    
            }
        console.log(result)
        const jsonValue = (result.length != 0 && empid != null)? result : 'result = ' + boolResult.toString()     
        return commonFun.converterJson(jsonValue);
        }catch(E){
            console.log(E)
        }
    }

}
