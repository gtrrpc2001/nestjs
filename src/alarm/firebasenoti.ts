import { ConfigService } from '@nestjs/config';
import { isDefined } from 'class-validator';
import * as admin from 'firebase-admin';
import { staticConfigValue } from 'src/config/staticConfigValue';
import { ecg_csv_ecgdataDTO } from 'src/dto/ecg_csv_ecgdata.dto';
import { wordNational } from 'src/interface/wordNational';

export class firebasenoti{

   static check = 0
    static async PushNoti(tokens:string[],body:ecg_csv_ecgdataDTO,configService:ConfigService): Promise<boolean>{
        try{
          let path = staticConfigValue.getFirebase_sdk(configService).path                    
          let android = require(path)
          let iosPath = staticConfigValue.getFirebase_sdk_ios(configService).path   
          let ios = require(iosPath)          
          let phone = [admin.credential.cert(android),admin.credential.cert(ios)]                   
          for(var i = 0; i < phone.length; i++){
            await this.setAndroid_Ios(tokens,body,phone[i])
          }          
          return true    
          }catch{           
             return false
          }
    }

    static async setAndroid_Ios(tokens:string[],body:ecg_csv_ecgdataDTO,phone:any): Promise<boolean>{
      try{
        admin.initializeApp({        
          credential: admin.credential.cert(phone) ,                
        });
        this.check = 0
        return await this.setPushAlarm(tokens,body.arrStatus,body.writetime,body.address,body.bodystate,body.timezone) 
      } catch(E){        
        admin.app().delete()
        this.check++
        if(this.check == 2) return 
        return await this.setAndroid_Ios(tokens,body,phone)
      }          
    }

   static async setPushAlarm(tokens:string[],arrStatus:string,time:string,address:string,bodystate:number,timezone:string): Promise<boolean>{
        try{    
         const interfaceTitle = this.getTitle(arrStatus,bodystate,timezone)
         const interfaceBody = this.getBody(address,time)
         const nationalCheck = !timezone.includes('US')
         let title = nationalCheck ? interfaceTitle.ko : interfaceTitle.en
         let body = nationalCheck?  interfaceBody.ko : interfaceBody.en
         console.log('여기 ' + title)
          await admin
          .messaging()
          .sendEachForMulticast({
            notification: {title,body},
            tokens: tokens,
            android: {priority:'high'},
            apns:{
              payload:{
                aps:{
                  sound:'basicsound.wav'
                }                
              }
            }
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

      static getBody(address:string,time:string):wordNational{
        const koBody = `${isDefined(address) ? '발생주소:' + address : ""} 시간: ${this.getTime(time)}`
        const enBody = `${isDefined(address) ? 'User Location:' + address : ""} time: ${this.getTime(time)}`
       let bodyNational:wordNational = {ko:koBody,en:enBody,ja:null,ch:null}        
       return bodyNational
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
    
      static getTitle(arrStatus:string,bodystate:number,timezone:string):wordNational{                
        let kTitle = `${bodystate == 1 ? "긴급!! 심장마비" : this.getStatus(arrStatus)} 발생!`
        let eTitle = `${bodystate == 1 ? "emergency!! Heart attack issue" : ` ${this.getENGStatus(arrStatus)}`} detected!`
        let translate:wordNational = {en:eTitle,ko:kTitle,ja:null,ch:null}
        return translate
      }

      static getStatus(arrStatus:string): string{
        switch(arrStatus){
          case "slow":
            return "느린맥박"  
          case "fast":
            return "빠른맥박"  
          case "irregular":
           return  "연속적인 비정상맥박"  
        default :
          return "비정상맥박"
        }        
      }

      static getENGStatus(arrStatus:string):string{
        switch(arrStatus){          
          case "irregular":
           return  "Heavy I.H.R."  
        case "arr" :
          return "I.H.R."
        case "slow":
            return "Slow heart rhythm"  
        case "fast":
            return "Fast heart rhythm"    
        }
      }
}