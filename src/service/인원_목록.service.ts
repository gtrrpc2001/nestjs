import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 인원_목록DTO } from '../dto/인원_목록.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { 인원_목록Entity } from 'src/entity/인원_목록.entity';
import { ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { isDefined } from 'class-validator';


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
            "성명":body.성명,"이메일":body.이메일,"핸드폰":body.핸드폰,"성별":body.성별,"신장":body.신장,"몸무게":body.몸무게,
            "나이":body.나이,"생년월일":body.생년월일,"설정_수면시작":body.설정_수면시작,"설정_수면종료":body.설정_수면종료,"설정_활동BPM":body.설정_활동BPM,
            "설정_일걸음":body.설정_일걸음,"설정_일거리":body.설정_일거리,"설정_일활동칼로리":body.설정_일활동칼로리,"설정_일칼로리":body.설정_일칼로리,
            "알림_sms":body.알림_sms,"시간차이":body.시간차이
        })
        .where({"아이디":body.아이디})
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
            아이디:body.아이디,패스워드키:body.패스워드키,성명:body.성명,이메일:body.이메일,핸드폰:body.핸드폰,
            성별:body.성별,신장:body.신장,몸무게:body.몸무게,나이:body.나이,생년월일:body.생년월일,
            설정_수면시작:body.설정_수면시작,설정_수면종료:body.설정_수면종료,설정_활동BPM:body.설정_활동BPM,
            설정_일걸음:body.설정_일걸음,설정_일거리:body.설정_일거리,설정_일활동칼로리:body.설정_일활동칼로리,
            설정_일칼로리:body.설정_일칼로리,알림_sms:body.알림_sms,시간차이:body.시간차이
        }])
        .execute()        
        return true
    }catch(E){
        console.log(E)
    }    
  } 

  async getProfile(empid:string): Promise<string>{
    //프로필정보 -- 보호자 번호까지 받아옴    
    var boolResult = false 
    try{
        let select = 'a.아이디,a.성명,a.이메일,a.핸드폰,a.성별,a.신장,a.몸무게,a.나이,a.생년월일,a.가입일,'+
        'a.설정_수면시작,a.설정_수면종료,a.설정_활동BPM,a.설정_일걸음,a.설정_일거리,a.설정_일활동칼로리,' +
        'a.설정_일칼로리,a.알림_sms,a.시간차이,b.phone'
        const result = await this.인원_목록Repository.createQueryBuilder('a')        
    .select(select)    
    .leftJoin(parentsEntity,'b','a.아이디 = b.eq')    
    .where({"아이디":empid})    
    .getRawMany()    
    console.log(result)
    const jsonValue = (result.length != 0 && empid != null)? result : 'result = ' + boolResult.toString()     
    return commonFun.converterJson(jsonValue);
    }catch(E){
        console.log(E)
    }    
  } 

  async CheckLoginGuardianApp(empid:string,pw:string,phone:string,token: string): Promise<boolean>{
    // 보호자앱 phone 번호까지 로그인 할떄 체크 후 token update    
    let boolResult = false
    if(isDefined(empid) && isDefined(pw) && isDefined(phone)){    
     boolResult = await this.guardianLoginCheck(empid,pw,phone)
     console.log(`보호자앱 로그인 체크 ${boolResult}`)  
        
     if(boolResult && isDefined(token)){
        const parentsResult = await this.tokenUpdateGuardianApp(empid,phone,token)
        return parentsResult
     }   
    }
    return boolResult
  }

  async tokenUpdateGuardianApp(empid:string,phone:string,token: string): Promise<boolean>{
   try{
        await this.parentsRepository.createQueryBuilder()
        .update(parentsEntity)
        .set({token:token})
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
        let select = 'b.eq,b.phone,a.패스워드키'
        let condition = `a.아이디 = b.eq and b.phone = ${phone}`
        const result = await this.인원_목록Repository.createQueryBuilder('a')
        .select(select)
        .leftJoin(parentsEntity,'b',condition)
        .where({"아이디":empid}).andWhere({"패스워드키":pw})
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
    const result = await this.인원_목록Repository.createQueryBuilder('인원_목록')
    .select('아이디,패스워드키')    
    .where({"아이디":empid}).andWhere({"패스워드키":pw})    
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
        const result: 인원_목록Entity[] = await this.인원_목록Repository.createQueryBuilder('인원_목록')
        .select('아이디')    
        .where({"아이디":empid})    
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
        const result: 인원_목록Entity[] = await this.인원_목록Repository.createQueryBuilder('인원_목록')
        .select('아이디')    
        .where({"성명":name}).andWhere({"핸드폰":phone}).andWhere({"생년월일":birth})    
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
        .set({ "패스워드키":body.패스워드키})
        .where({"아이디":body.아이디})
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

