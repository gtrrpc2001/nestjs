import { ConfigService } from '@nestjs/config';


export class staticConfigValue{  
   static getFirebase_sdk = (configService:ConfigService):{projectID:string,privateKey:string} => { 
                
        return {
           projectID: configService.get<string>('ANDROIDID'),
           privateKey: configService.get<string>('ANDROIDKEY')
        }
    }

    static getFirebase_sdk_ios = (configService:ConfigService):{projectID:string,privateKey:string} => { 
                
      return {
         projectID: configService.get<string>('IOSDID'),
         privateKey: configService.get<string>('IOSKEY')
      }
  }

}