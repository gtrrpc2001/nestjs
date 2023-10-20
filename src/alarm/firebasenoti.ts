import { ConfigService } from '@nestjs/config';
import { isDefined } from 'class-validator';
import * as admin from 'firebase-admin';
import { staticConfigValue } from 'src/config/staticConfigValue';
import { ecg_csv_ecgdataDTO } from 'src/dto/ecg_csv_ecgdata.dto';

export class firebasenoti{

    static async PushNoti(tokens:string[],body:ecg_csv_ecgdataDTO,configService:ConfigService): Promise<boolean>{
        try{
          let path = staticConfigValue.getFirebase_sdk(configService).path
          
            //let serAccount = require('C:/Users/cho/Desktop/mslback_last/mslback/our-nest/firebase-adminsdk.json')        
            let serAccount = require(path)        
            admin.initializeApp({
                credential: admin.credential.cert(serAccount),
              });
          }catch{
             
          }          
        return await this.setPushAlarm(tokens,body.arrStatus,body.writetime,body.address,body.bodystate,) 
    }

   static async setPushAlarm(tokens:string[],arrStatus:string,time:string,address:string,bodystate:number): Promise<boolean>{
        try{      
         let title = `${bodystate == 1 ? "긴급!! 심장마비" : this.getTitle(arrStatus)} 발생!`
         let body = `${isDefined(address) ? '발생주소:' + address : ""}시간: ${this.getTime(time)}`
          await admin
          .messaging()
          .sendEachForMulticast({
            notification: {title,body},
            tokens: tokens,
            android: {priority:'high'},
          })
          .catch((error: any) => {
            console.error(error)
            return false;
          })
          return true;
        }catch(E){
          console.log(E)
          return false;
        }    
      }

      static splitTime(time:string):string{
        let resultTime:string[]
        switch(time.length){
          case 19 :
            resultTime = time.split(' ')
            return resultTime[1]
          default :
            let afterTimes = time.split('T')
            resultTime = afterTimes[1].split('.')
            return resultTime[0]
        } 
      }

   static getTime(time:string):string{    
        let resultTime = this.splitTime(time)
        return resultTime
      }
    
      static getTitle(arrStatus:string):string{
        switch(arrStatus){
          case "arr" :
            return "비정상맥박"
          case "slow":
            return "느린맥박"  
          case "fast":
            return "빠른맥박"  
          case "irregular":
            return "연속적인 비정상맥박"  
        }
      }
}