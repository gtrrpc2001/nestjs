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
          console.log('성공')      
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
        console.log(E)
        try{
          console.log(admin.app().name)
          if (this.check == 0) admin.app().delete();
          this.check++
          if(this.check == 2) return false;
          return await this.setAndroid_Ios(tokens,body,phone)
        }catch(E){
          console.log(E)
          console.log('alarm 부분 error 확인바람')  
          return false;    
        }
      }          
    }

   static async setPushAlarm(tokens:string[],arrStatus:string,time:string,address:string,bodystate:number,timezone:string): Promise<boolean>{
        try{                      
         let title = this.getTitle(arrStatus,bodystate,timezone)
         let body = this.getBody(address,time,timezone)    
         console.log('성공 ' + title)
          await admin
          .messaging()
          .sendEachForMulticast({
            notification: {title,body},
            tokens: tokens,
            android: {priority:'high'},
            apns:{
              payload:{
                aps:{
                  sound: bodystate == 1 ? 'heartAttackSound.wav' :'basicsound.wav'
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

      static getBody(address:string,time:string,timezone:string):string{
        switch(true){
          case timezone?.includes('US'):
            return `${isDefined(address) ? 'User Location:' + address : ""} time: ${this.getTime(time)}`
          case timezone?.includes('MO'):
            return `${isDefined(address) ? '使用者位置:' + address : ""} 时间: ${this.getTime(time)}`
          default :          
            return `${isDefined(address) ? '발생주소:' + address : ""} 시간: ${this.getTime(time)}`
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
    
      static getTitle(arrStatus:string,bodystate:number,timezone:string):string{

        switch(true){
          case timezone?.includes('US'):
            return `${bodystate == 1 ? "emergency!! Heart attack issue" : ` ${this.getENGStatus(arrStatus)}`} detected!`
          case timezone?.includes('MO'):
            return `${bodystate == 1 ? "紧急状况!!" : ` ${this.getChStatus(arrStatus)}`}`
          default :
            return `${bodystate == 1 ? "긴급!! 심장마비" : this.getStatus(arrStatus)} 발생!`
        }                                                 
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

      static getChStatus(arrStatus:string):string{
        switch(arrStatus){          
          case "irregular":
           return  "检测到心律不齐!"  
        case "arr" :
          return "检测到心律不规则!"
        case "slow":
            return " 检测到心率偏低!"  
        case "fast":
            return "检测到心率偏高!"    
        }
      }
}

