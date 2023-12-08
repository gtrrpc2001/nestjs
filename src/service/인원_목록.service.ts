import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 인원_목록DTO } from '../dto/인원_목록.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { 인원_목록Entity } from 'src/entity/인원_목록.entity';
import { ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { isDefined } from 'class-validator';
import { commonQuery } from 'src/clsfunc/commonQuery';


@Injectable()
export class 인원_목록Service {
  ecg_raws: 인원_목록Entity[] = [];
  constructor(
  @InjectRepository(인원_목록Entity) private 인원_목록Repository:Repository<인원_목록Entity>,
  @InjectRepository(ecg_raw_history_lastEntity) private ecg_raw_history_lastRepository:Repository<ecg_raw_history_lastEntity>,
  @InjectRepository(parentsEntity) private parentsRepository:Repository<parentsEntity>
  ){}
  

  async gubunKind(body:인원_목록DTO): Promise<any>{   
    switch(body.kind){
        case "checkIDDupe" :
            return this.checkIDDupe(body.eq);
        case "checkLogin" :
            return this.checkLogin(body.eq,body.password,null,null)
        case "getProfile" :
            return this.getProfile(body.eq)
        case "checkReg" :
            return this.checkReg(body)
        case "setProfile" :
            return this.setProfile(body)
        case "updatePWD" :
            return this.updatePWD(body)
        case null  :
            return commonFun.converterJson('result = ' + false.toString());

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
        var jsonValue = 'result = ' + boolResult.toString()
        console.log('setProfile')
        return commonFun.converterJson(jsonValue);
    }catch(E){
        console.log(E)
        return E;
    }
  }

  async checkReg(body:인원_목록DTO): Promise<string>{
    var boolResult = false
    try{    
       const insertChecked =  await this.setInsert(body)
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

  async setInsert(body:인원_목록DTO):Promise<boolean>{
    try{
        const result = await this.인원_목록Repository.createQueryBuilder()
        .insert()
        .into(인원_목록Entity)
        .values([{
            eq:body.eq,password:body.password,eqname:body.eqname,email:body.email,phone:body.phone,sex:body.sex,
            height:body.height,weight:body.weight,age:body.age,birth:body.birth,sleeptime:body.sleeptime,
            uptime:body.uptime,bpm:body.bpm,step:body.step,distanceKM:body.distanceKM,
            cal:body.cal,calexe:body.calexe,alarm_sms:body.alarm_sms,differtime:body.differtime
        }])
        .execute()        
        return true
    }catch(E){
        console.log(E)
    }    
  } 

  async getProfile(empid:string): Promise<string>{
    //프로필정보 -- 보호자 번호까지 받아옴    
   return await commonQuery.getProfile(this.인원_목록Repository,parentsEntity,empid)
      
  } 

  async CheckLoginGuardianApp(empid:string,pw:string,phone:string,token: string): Promise<boolean>{
    // 보호자앱 phone 번호까지 로그인 할떄 체크 후 token update    
    let boolResult = false
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
        let select = 'b.eq,b.phone,a.password'
        let condition = `a.eq = b.eq and b.phone = ${phone}`
        const result = await this.인원_목록Repository.createQueryBuilder('a')
        .select(select)
        .innerJoin(parentsEntity,'b',condition)
        .where({"eq":empid}).andWhere({"password":pw})
        .getRawOne()

        if(!isDefined(result))
            return false;

        console.log(`여기 테스트 ${result}`)
        return result.length != 0 ? true : false
    }catch(E){
        console.log(E)
        return false;
    }    
  }



  async checkLogin(empid:string,pw:string,phone:string,token:string): Promise<string>{
    var boolResult = false
    if(isDefined(phone)){
        boolResult = await this.CheckLoginGuardianApp(empid,pw,phone,token)
    }else{
        boolResult = await this.userCheckLogin(empid,pw)        
    }
    var jsonValue = 'result = ' + boolResult.toString()
    console.log(`${empid}------${pw}-----${jsonValue}`)    
    return commonFun.converterJson(jsonValue);
    }  
    
  async userCheckLogin(empid:string,pw:string):Promise<boolean>{
   try{
    const result = await this.인원_목록Repository.createQueryBuilder('user')
    .select('eq,password')    
    .where({"eq":empid}).andWhere({"password":pw})    
    .getRawMany() 
    if(result.length != 0 && (empid != null && pw != null)){        
        return true;
    }else{
        return false;
    } 
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
            boolResult = true
        }  
    }else{
        
    }
    var jsonValue = 'result = ' + boolResult.toString()
    return commonFun.converterJson(jsonValue);
   }

    async findID(name:string,phone:string,birth:string): Promise<string>{
        var boolResult = false    
        console.log('checkIDDupe') 
        const result: 인원_목록Entity[] = await this.인원_목록Repository.createQueryBuilder('user')
        .select('eq')    
        .where({"eqname":name}).andWhere({"phone":phone}).andWhere({"birth":birth})    
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
        const result = await this.인원_목록Repository.createQueryBuilder()
        .update(인원_목록Entity)        
        .set({ "password":body.password})
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
    
}

