import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,MoreThanOrEqual,LessThanOrEqual} from 'typeorm';
import { commonFun } from "src/clsfunc/commonfunc";
import { ecg_byteEntity } from 'src/entity/ecg_byte.entity';
import { ecg_byteDTO } from 'src/dto/ecg_byte.dto';

@Injectable()
export class ecg_byteService {  
  constructor(@InjectRepository(ecg_byteEntity) private ecg_byteRepository:Repository<ecg_byteEntity>
  ){}

  table = 'ecg_csv_ecgdata'
  select = 'eq,writetime,bpm,ecgpacket'

  async gubunKind(body:ecg_byteDTO): Promise<any>{   
    switch(body.kind){        
        case "ecgByteInsert":
            return this.insertEcgPacket(body);
        case null  :
            return commonFun.converterJson('result = ' + false.toString());
    } 
  }

  async insertEcgPacket(body:ecg_byteDTO): Promise<string>{
    // var boolResult = false
    try{          
        const result = await this.setInsert(body)
        
        // if(result){            
        //     boolResult = await this.updateLast(body)
        // }
        console.log('ecgByteinsert')
        // var jsonValue = 'result = ' + boolResult.toString()
        var jsonValue = 'result = ' + result.toString()
        return commonFun.converterJson(jsonValue);
    }catch(E){
        //console.log(E) 
        return E;
    } 
  }

//   async updateLast(body:ecg_csv_ecgdataDTO): Promise<boolean>{    
// try{        
//     const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
//     .update(ecg_raw_history_lastEntity)        
//     .set({ "writetime":body.writetime,"bpm":body.bpm})
//     .where({"eq":body.eq})
//     .execute()        
//     console.log('updateLast')
//     return true;
// }catch(E){
//     //console.log(E) 대기열 문제 가끔 발생
//     return false;
// }             
// }



  async setInsert(body:ecg_byteDTO): Promise<boolean>{
    try{               
        const buffer = commonFun.getEcgBuffer(body.ecgPacket);
        const result = await this.ecg_byteRepository.createQueryBuilder()
        .insert()
        .into(ecg_byteEntity)
        .values([{
            eq:body.eq,writetime:body.writetime,timezone:body.timezone,bpm:body.bpm,
            ecgpacket:buffer
            // ecgpacket:() => `HEX(AES_ENCRYPT('${body.ecgPacket}','${key}'))`
        }])
        .execute()
        return true
    }catch(E){
        console.log(E)
        return false
    }
  }

    async getTest(empid:string,startDate:string,endDate:string): Promise<string>{        
        try{            
           const result = await this.ecg_byteRepository.createQueryBuilder()
                                .select('writetime,ecgpacket')                                
                                .where({"eq":empid})
                                .andWhere({"writetime":MoreThanOrEqual(startDate)})
                                .andWhere({"writetime":LessThanOrEqual(endDate)})                                
                                .getRawMany()
            const value = result.map(d => async function(){
                                    const {writetime,ecgpacket} = d                                                                         
                                    const ecg = commonFun.getEcgNumber(ecgpacket)
                                    return {writetime,ecg}
                                });                                                                               
        // .select(`writetime,AES_DECRYPT(UNHEX(ecgpacket), ${key}) ecgpacket`)                                
        //   const changeEcg:number[] = await commonFun.getEcgNumArr(result)  
        //   const Value = (result.length != 0 && empid != null)? changeEcg : [0]                                
          return commonFun.converterJson(value);    
        } catch(E){
            console.log(E)
        }         
    }

//   async getEcg (empid:string,startDate:string): Promise<number[]>{        
//     try{
//        const result = await this.ecg_csv_ecgdataRepository.createQueryBuilder('ecg_csv_ecgdata')
//                             .select('ecgpacket')                                
//                             .where({"eq":empid})
//                             .andWhere({"writetime":MoreThanOrEqual(startDate)})
//                             .getRawMany()
//       const changeEcg:number[] = await commonFun.getEcgNumArr(result)      
//       const Value = (result.length != 0 && empid != null)? changeEcg : [0]
//       console.log(empid)                                                    
//       return Value;    
//     } catch(E){
//         console.log(E)
//     }                 
  
//  }

//    async ecgPacket(empid:string,startDate:string,endDate:string): Promise<string>{    
//     console.log('ecgPacket')       
//     const result = await commonQuery.whereIfResult(this.ecg_csv_ecgdataRepository,this.table,this.select,empid,startDate,endDate);  
//     const Value = (result.length != 0 && empid != null)? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
//     return Value;    
//     } 

//     async getEcgTime(empid:string,startDate:string,endDate:string): Promise<string[]>{        
//         try{
//            const result = await this.ecg_csv_ecgdataRepository.createQueryBuilder('ecg_csv_ecgdata')
//                                 .select('Mid(writetime,12,4) writetime')                                
//                                 .where({"eq":empid})
//                                 .andWhere({"writetime":MoreThanOrEqual(startDate)})
//                                 .andWhere({"writetime":LessThan(endDate)})
//                                 .groupBy('Mid(writetime,12,4)')
//                                 .getRawMany()                    
//           console.log(empid)                                                    
//           return result;    
//         } catch(E){
//             console.log(E)
//         }                 
      
//      }

//      async getGraphEcgValue(empid:string,startDate:string,endDate:string): Promise<string[]>{        
//         try{
//            const result = await this.ecg_csv_ecgdataRepository.createQueryBuilder('ecg_csv_ecgdata')
//                                 .select('writetime,ecgpacket')                                
//                                 .where({"eq":empid})
//                                 .andWhere({"writetime":MoreThanOrEqual(startDate)})
//                                 .andWhere({"writetime":LessThanOrEqual(endDate)})                                
//                                 .getRawMany()                                               
//           const changeEcg:number[] = await commonFun.getEcgNumArr(result)  
//         //   const Value = (result.length != 0 && empid != null)? changeEcg : [0]                                
//           return result;    
//         } catch(E){
//             console.log(E)
//         }                 
      
//      }
}