import { ecg_raw_history_lastEntity } from "src/entity/ecg_raw_history_last.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,MoreThanOrEqual,MoreThan } from 'typeorm';
import { ecg_raw_history_lastDTO } from "../dto/ecg_raw_history_last.dto";
import { commonFun } from 'src/clsfunc/commonfunc';
import { ecg_csv_datadayEntity } from "src/entity/ecg_csv_dataday.entity";

@Injectable()
export class ecg_raw_history_lastService {
  ecg_raws: ecg_raw_history_lastEntity[] = [];    
  constructor(
    @InjectRepository(ecg_raw_history_lastEntity) private ecg_raw_history_lastRepository:Repository<ecg_raw_history_lastEntity>,
    @InjectRepository(ecg_csv_datadayEntity) private ecg_csv_datadayRepository:Repository<ecg_csv_datadayEntity>
    ){}

  async gubunKind(body:ecg_raw_history_lastDTO): Promise<any>{   
    switch(body.kind){
        case "getdata" :
            return this.getEcg_raw_history_last(body.eq);
        case null  :
            return false;
    } 
  }  
  
   async getEcg_raw_history_last(empid:string): Promise<string>{        
    try{
      const result: ecg_raw_history_lastEntity[] = await this.ecg_raw_history_lastRepository.createQueryBuilder('ecg_raw_history_last')
      .select('bpm')    
      .where({"eq":empid})    
      .getRawMany() 
  
      console.log(`history 사용중 ${empid}`)
      const Value = (result.length != 0 && empid != null)? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
      
      return Value;
    }catch(E){
      console.log(E)
    }
    
    }
    
    
    
    async gethistory_last(writetime:string): Promise<string>{
      const select = 'a.idx,a.eq,eqname,a.writetime,a.bpm,a.hrv,mid(a.temp,1,5) temp,b.step step, b.distanceKM distanceKM, b.cal cal, b.calexe calexe, b.arrcnt arrcnt,a.timezone'              
      try{
        const subQuery = await this.subQueryDataDay(writetime)
        const result: ecg_raw_history_lastEntity[] = await this.ecg_raw_history_lastRepository.createQueryBuilder('a')
        .select(select)         
        .leftJoin(subQuery,'b','a.eq = b.eq')
        .orderBy('writetime' ,'DESC')   
        .getRawMany()  
        
        const Value = (result.length != 0 && writetime != null)? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')       
        
        return Value;
      }catch(E){
        console.log(E)
      }
      
      }
      
     async subQueryDataDay(writetime:string): Promise<string>{
        const subSelect = 'eq ,sum(step) step,sum(distanceKM) distanceKM,sum(cal) cal,sum(calexe) calexe,sum(arrcnt) arrcnt'
        try{
          
          const result = await this.ecg_csv_datadayRepository.createQueryBuilder()
          .subQuery()
          .select(subSelect)
          .from(ecg_csv_datadayEntity,'')
          .where(`writetime >= '${writetime}'`)          
          .groupBy('eq')          
          .getQuery()          

          return result

        }catch(E){
          console.log(E)
        }
      }

}