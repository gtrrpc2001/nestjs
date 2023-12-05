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
            return this.checkIDDupe(body.아이디);
        case "checkLogin" :
            return this.checkLogin(body.아이디,body.패스워드키,null,null)
        case "getProfile" :
            return this.getProfile(body.아이디)
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
            "eq":body.성명,"email":body.이메일,"phone":body.핸드폰,"sex":body.성별,"height":body.신장,"weight":body.몸무게,
            "age":body.나이,"birth":body.생년월일,"sleeptime":body.설정_수면시작,"uptime":body.설정_수면종료,"bpm":body.설정_활동BPM,
            "step":body.설정_일걸음,"distanceKM":body.설정_일거리,"calexe":body.설정_일활동칼로리,"cal":body.설정_일칼로리,
            "alarm_sms":body.알림_sms,"differtime":body.시간차이
        })
        .where({"eq":body.아이디})
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
                eq:body.아이디,eqname:body.성명,writetime:datatime
           }])
           .execute()

           console.log(`${body.아이디}--${body.성명}`)
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
            eq:body.아이디,password:body.패스워드키,eqname:body.성명,email:body.이메일,phone:body.핸드폰,
            sex:body.성별,height:body.신장,weight:body.몸무게,age:body.나이,birth:body.생년월일,
            sleeptime:body.설정_수면시작,uptime:body.설정_수면종료,bpm:body.설정_활동BPM,
            step:body.설정_일걸음,distanceKM:body.설정_일거리,calexe:body.설정_일활동칼로리,
            cal:body.설정_일칼로리,alarm_sms:body.알림_sms,differtime:body.시간차이
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
        .set({ "password":body.패스워드키})
        .where({"eq":body.아이디})
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

