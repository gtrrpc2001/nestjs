import { MoreThanOrEqual,LessThan,LessThanOrEqual } from 'typeorm';

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

}