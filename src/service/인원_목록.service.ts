import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 인원_목록DTO } from '../dto/인원_목록.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { DeleteUserLogEntity, 인원_목록Entity } from 'src/entity/인원_목록.entity';
import { delete_user_last_logEntity, ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { isDefined } from 'class-validator';
import { commonQuery } from 'src/clsfunc/commonQuery';
import { pwBcrypt } from 'src/clsfunc/pwAES';


@Injectable()
export class 인원_목록Service {
  ecg_raws: 인원_목록Entity[] = [];
  constructor(
  @InjectRepository(인원_목록Entity) private 인원_목록Repository:Repository<인원_목록Entity>,
  @InjectRepository(ecg_raw_history_lastEntity) private ecg_raw_history_lastRepository:Repository<ecg_raw_history_lastEntity>,
  @InjectRepository(parentsEntity) private parentsRepository:Repository<parentsEntity>,
  @InjectRepository(DeleteUserLogEntity) private DeleteUserLogRepository:Repository<DeleteUserLogEntity>,
  @InjectRepository(delete_user_last_logEntity) private delete_user_last_logRepository:Repository<delete_user_last_logEntity>,
  ){}
  

  async gubunKind(body:인원_목록DTO): Promise<any>{   
    switch(body.kind){
        case "checkIDDupe" :
            return await this.checkIDDupe(body.eq);
        case "checkLogin" :
            return await this.checkLogin(body.eq,body.password,null,null)
        case "getProfile" :
            return await this.getProfile(body.eq)
        case "checkReg" :
            return await this.checkReg(body)
        case "setProfile" :
            return await this.setProfile(body)
        case "updatePWD" :
            return await this.updatePWD(body)        
        case "deleteUser" :
            return await this.userDelete(body);
        case "updateDifferTime" :
            return await this.updateLogin_out(body.eq,body.differtime)
        case "updateAppKey" :
            return await this.updateAppKey(body.eq,body.appKey)
        case null  :
            return commonFun.converterJson('result = ' + false.toString());

    } 
    
  }  

  async userDelete(body:인원_목록DTO):Promise<boolean>{
    try{
        let bool = await this.setInsert(this.DeleteUserLogRepository,DeleteUserLogEntity,body);
        let lastInsert = await this.setLastLogInsert(body.eq)
        if(bool && lastInsert)
        {         
            return await this.setDelete(body.eq)            
        }else{
            return false
        }
    }catch(E){
        console.log(E)
        return false;
    }
  }

  async setLastLogInsert(eq:string):Promise<boolean>{
        try{
            const info = await this.getLastInfo(eq)
            await this.delete_user_last_logRepository.createQueryBuilder()
                            .insert()
                            .into(delete_user_last_logEntity)
                            .values([{
                                eq:info.eq,eqname:info.eqname,writetime:info.writetime,timezone:info.timezone,bpm:info.bpm,hrv:info.hrv,
                                cal:info.cal,calexe:info.calexe,step:info.step,distanceKM:info.distanceKM,arrcnt:info.arrcnt,
                                temp:info.temp,battery:info.battery,bodystate:info.bodystate,isack:info.isack,log:info.log
                            }])
                            .execute()
            return true;
        }catch(E){
            console.log(E)
            return false;
        }
  }

  async getLastInfo(eq:string):Promise<ecg_raw_history_lastEntity>{
    try{
        const result:ecg_raw_history_lastEntity = await this.ecg_raw_history_lastRepository
                                                    .createQueryBuilder()
                                                    .select('*')
                                                    .where({"eq":eq})
                                                    .getRawOne()
        return result
    }catch(E){
        console.log(E)
        return;
    }
  }

  async setDelete(eq:string):Promise<boolean>{
        try{
            const result = await this.인원_목록Repository.createQueryBuilder()
                                    .delete()                                    
                                    .where({"eq":eq})
                                    .execute()
            await this.lastDelete(eq)
            return true;
        }catch(E){
            console.log(E)
            return false;
        }
  }

  async lastDelete(eq:string):Promise<boolean>{
    try{
        await this.ecg_raw_history_lastRepository.createQueryBuilder()
                    .delete()                                    
                    .where({"eq":eq})
                    .execute()
        return true;
    }catch(E){
        console.log(E)
        return false;
    }
  }

  async setProfile(body:인원_목록DTO): Promise<string>{
    var boolResult = false
    try{        
        const result = await this.인원_목록Repository.createQueryBuilder()
        .update(인원_목록Entity)        
        .set({
            "eqname":body.eqname,"email":body.email,"phone":body.phone,"sex":body.sex,"height":body.height,"weight":body.weight,
            "age":body.age,"birth":body.birth,"sleeptime":body.sleeptime,"uptime":body.uptime,"bpm":body.bpm,
            "step":body.step,"distanceKM":body.distanceKM,"cal":body.cal,"calexe":body.calexe,
            "alarm_sms":body.alarm_sms,"differtime":body.differtime
        })
        .where({"eq":body.eq})
        .execute()        
        boolResult = true
        if(boolResult)
            boolResult = await this.lastUpdate(body)        
        var jsonValue = 'result = ' + boolResult.toString()
        console.log('setProfile')
        return commonFun.converterJson(jsonValue);
    }catch(E){
        console.log(E)
        return E;
    }
  }

  async lastUpdate(body:인원_목록DTO):Promise<boolean>{
    try{
        await this.ecg_raw_history_lastRepository.createQueryBuilder()
        .update(ecg_raw_history_lastEntity)
        .set({
            "eqname":body.eqname
        })
        .where({"eq":body.eq})
        .execute()
        return true;
    }catch(E){
        console.log(E)
        return false;
    }
  }

  async checkReg(body:인원_목록DTO): Promise<string>{
    var boolResult = false
    try{    
       const insertChecked =  await this.setInsert(this.인원_목록Repository,인원_목록Entity,body)
        if(insertChecked){          
          const datatime = commonFun.getWritetime()
          const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
                                .insert()
                                .into(ecg_raw_history_lastEntity)
                                .values([{
                                        eq:body.eq,eqname:body.eqname,writetime:datatime
                                }])
                                .execute()
           console.log(`${body.eq}--${body.eqname}`)
           boolResult = true;
        }
        var jsonValue = 'result = ' + boolResult.toString()
        return commonFun.converterJson(jsonValue);
    }catch(E){
        console.log(E)
        return E;
    }  
    
  }

  async setInsert(repository:any,entity:any,body:인원_목록DTO):Promise<boolean>{
    try{
        const AESpwd = await pwBcrypt.transformPassword(body.password)
        const result = await repository.createQueryBuilder()
                            .insert()
                            .into(entity)
                            .values([{
                                eq:body.eq,password:AESpwd,eqname:body.eqname,email:body.email,phone:body.phone,sex:body.sex,
                                height:body.height,weight:body.weight,age:body.age,birth:body.birth,sleeptime:body.sleeptime,
                                uptime:body.uptime,bpm:body.bpm,step:body.step,distanceKM:body.distanceKM,
                                cal:body.cal,calexe:body.calexe,alarm_sms:body.alarm_sms,differtime:body.differtime
                            }])
                            .execute()
        console.log('delete 저장부분')        
        return true
    }catch(E){
        console.log(E)
        return false
    }    
  } 

  async getProfile(empid:string): Promise<string>{
    //프로필정보 -- 보호자 번호까지 받아옴    
   return await commonQuery.getProfile(this.인원_목록Repository,parentsEntity,empid)
      
  } 

  async CheckLoginGuardianApp(empid:string,pw:string,phone:string,token: string): Promise<any>{
    // 보호자앱 phone 번호까지 로그인 할떄 체크 후 token update    
    let boolResult:any = false
    if(isDefined(empid) && isDefined(pw) && isDefined(phone)){    
     boolResult = await this.guardianLoginCheck(empid,pw,phone)
     console.log(`보호자앱 로그인 체크 ${boolResult}`)  
        
     if(boolResult && isDefined(token)){
        console.log('여기 ' + token )
        const parentsResult = await this.tokenUpdateGuardianApp(empid,phone,token)
        return parentsResult
     }   
    }
    return boolResult
  }

  async tokenUpdateGuardianApp(empid:string,phone:string,token:string): Promise<boolean>{
   try{
        await this.parentsRepository.createQueryBuilder()
        .update(parentsEntity)
        .set({token:token,writetime:commonFun.getWritetime()})
        .where({"eq":empid}).andWhere({"phone":phone})
        .execute()        
        return true;
   }catch(E){
        console.log(E)
        return false;
   }    
  }

  async guardianLoginCheck(empid:string,pw:string,phone:string):Promise<boolean>{
    try{
        let select = 'b.eq,b.phone,a.password,a.differtime'
        let condition = `a.eq = b.eq and b.phone = ${phone}`       
        const result = await this.인원_목록Repository.createQueryBuilder('a')
                                .select(select)
                                .innerJoin(parentsEntity,'b',condition)
                                .where({"eq":empid})
                                .getRawOne()
        const {password,differtime} = result
        const otherAppLoginCheck = 0 //differtime
        return await this.login_outCheck(pw,password,otherAppLoginCheck);
    }catch(E){
        console.log(E)
        return false;
    }    
  }



  async checkLogin(empid:string,pw:string,phone:string,token:string,destroy:boolean=false): Promise<string>{
        if(empid == "admin" && pw == "admin")
             destroy = true;

        var boolResult:any = false
        console.log('여기맞나' + phone)
        if(isDefined(phone)){            
            boolResult = await this.CheckLoginGuardianApp(empid,pw,phone,token)
        }else{
            boolResult = await this.checkPassword(empid,pw,destroy)
        }
        if(String(boolResult).includes('true') && !destroy &&!isDefined(phone))
            boolResult = await this.updateLogin_out(empid,1)


        var jsonValue = 'result = ' + boolResult.toString()
        console.log(`${empid}------${pw}-----${jsonValue}`)    
        return commonFun.converterJson(jsonValue);
    } 
    
    async checkPassword(empid:string,pw:string,destroy:boolean):Promise<any>{
        try{
            const result:인원_목록Entity = await this.인원_목록Repository.createQueryBuilder('user')
                            .select('password,differtime')    
                            .where({"eq":empid})
                            .getRawOne()
            const password = result.password
            const otherAppLoginCheck = destroy ? 0 : Number(result.differtime)              
            return await this.login_outCheck(pw,password,otherAppLoginCheck);
        }catch(E){
            console.log(E)
            return false
        }        
    }

    async login_outCheck(pw:string,password:string,otherAppLoginCheck:number):Promise<any>{
        if(otherAppLoginCheck == 0){            
            return await pwBcrypt.validatePwd(pw,password);
        }else{            
            return "다른곳에서 로그인 중"
        }
    }
    
    async updateLogin_out(empid:string,loginNumber:number):Promise<boolean>{
        try{
            const result = await this.인원_목록Repository.createQueryBuilder()
                                            .update(인원_목록Entity)        
                                            .set({ "differtime":loginNumber})
                                            .where({"eq":empid})
                                            .execute()                                            
            return true;
        }catch(E){
            console.log(E)
            return false;
        }
    }
  
  async checkIDDupe(empid:string): Promise<string>{
    var boolResult = false    
    console.log('checkIDDupe')    
    if(isDefined(empid)){
        const result: 인원_목록Entity[] = await this.인원_목록Repository.createQueryBuilder('user')
                                                .select('eq')    
                                                .where({"eq":empid})    
                                                .getRawMany()
        if(result.length == 0){        
            const rs = await this.DeleteUserLogRepository.createQueryBuilder()
                        .select('eq')
                        .where({"eq":empid})
                        .getRawMany()
            if(rs.length == 0)
                boolResult = true        
        }  
    }
    var jsonValue = 'result = ' + boolResult.toString()
    return commonFun.converterJson(jsonValue);
   }

    async findID(name:string,phone:string,birth:string): Promise<string>{
        var boolResult = false    
        console.log('checkIDDupe') 
        const result: 인원_목록Entity[] = await this.인원_목록Repository.createQueryBuilder('user')
                                            .select('eq')    
                                            .where({"eqname":name})
                                            .andWhere({"phone":phone})
                                            .andWhere({"birth":birth})    
                                            .getRawMany()
        
        if(result.length != 0 && (name != "" && phone != "" && birth != "")){
            return commonFun.converterJson(result);
        }else{
            var jsonValue = 'result = ' + boolResult.toString()
            return commonFun.converterJson(jsonValue);
        }              
    }

    async updatePWD(body:인원_목록DTO): Promise<string>{
        var boolResult = false
        try{        
            const AESpwd = await pwBcrypt.transformPassword(body.password)
            const result = await this.인원_목록Repository.createQueryBuilder()
                                        .update(인원_목록Entity)        
                                        .set({ "password":AESpwd})
                                        .where({"eq":body.eq})
                                        .execute()
            boolResult = true
            var jsonValue = 'result = ' + boolResult.toString()
            console.log('updatePWD')
            return commonFun.converterJson(jsonValue);
        }catch(E){
            console.log(E)
            return E;
        }             
    }

    async checkPhone(phone:string):Promise<string>{
        try{
            var bool = false
            const result = await this.인원_목록Repository.createQueryBuilder()
                            .select('phone')
                            .where({"phone":phone})
                            .getRawMany()
            if(result.length == 0)
                bool = true
            var jsonValue = 'result = ' + bool.toString()
            console.log('checkPhone')
            return commonFun.converterJson(jsonValue);
        }catch(E){
            console.log(E)
        }
    }

    async getAppKey(empid:string):Promise<string>{
        try{
            const result:인원_목록Entity = await this.인원_목록Repository.createQueryBuilder('user')
                            .select('appKey')    
                            .where({"eq":empid})
                            .getRawOne()            
           return commonFun.converterJson(result.appKey);
        }catch(E){
            console.log(E)            
        }        
    }

    async updateAppKey(empid:string,appKey:number):Promise<any>{
        try{
            const result = await this.인원_목록Repository.createQueryBuilder()
                                        .update(인원_목록Entity)        
                                        .set({ "appKey":appKey})
                                        .where({"eq":empid})
                                        .execute()
            return true;
        }catch(E){
            console.log(E)
            return false;
        }
    }
    
}

