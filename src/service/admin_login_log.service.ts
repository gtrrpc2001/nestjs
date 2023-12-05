import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { admin_login_logEntity } from 'src/entity/admin_login_log.entity';
import { admin_login_logDTO } from 'src/dto/admin_login_log.dto';

@Injectable()
export class admin_login_logService {
  log_raws: admin_login_logEntity[] = [];    
  constructor(@InjectRepository(admin_login_logEntity) private admin_login_logRepository:Repository<admin_login_logEntity>){}
 
  async LogInsert(body:admin_login_logDTO): Promise<any>{   
    var boolResult = false
    try{        
        const result = await this.admin_login_logRepository.createQueryBuilder()
        .insert()
        .into(admin_login_logEntity)
        .values([{
            gubun:body.구분,eq:body.아이디,eqname:body.성명,writetime:body.날짜,activity:body.활동
        }])
        .execute()
        boolResult = true
        var jsonValue = 'result = ' + boolResult.toString()
        console.log('admin - insert')
        return jsonValue;
    }catch(E){
        console.log(E)
        return E;
    }
  }  
}