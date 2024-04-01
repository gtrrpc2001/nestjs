import { staticConfigValue } from 'src/config/staticConfigValue';
import { ConfigService } from '@nestjs/config';
import { firebasenoti } from './firebasenoti';

export class iosNoti{
    
    static ios:{
      projectID: string;
      privateKey: string;
  }

    static setPath = (configService:ConfigService)  => {                
        this.ios = staticConfigValue.getFirebase_sdk_ios(configService)   
    }    

    static async IOS(configService:ConfigService): Promise<boolean>{
        try{     

          if(this.ios.projectID == ""){
            this.setPath(configService);            
            firebasenoti.initializeApp(this.ios,'IOS')
          }                  
          return true    

          }catch(E){
            console.log('여기서 빠짐')           
            console.log(E) 
             return false
          }
    }
}