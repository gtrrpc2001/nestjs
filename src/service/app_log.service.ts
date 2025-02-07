import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { app_logEntity } from 'src/entity/app_log.entity';
import { admin_login_logDTO } from 'src/dto/admin_login_log.dto';
import { db } from 'src/clsfunc/commonfunc';

@Injectable()
export class app_logService {
  constructor(@InjectRepository(app_logEntity, db.deploy) private app_logRepository: Repository<app_logEntity>) { }

  async LogInsert(body: admin_login_logDTO): Promise<any> {
    var boolResult = false
    try {
      const result = await this.app_logRepository.createQueryBuilder()
        .insert()
        .into(app_logEntity)
        .values([{
          eq: body.eq, phone: body.phone, writetime: body.writetime, gubun: body.gubun, activity: body.activity
        }])
        .execute()
      boolResult = true
      var jsonValue = 'result = ' + boolResult.toString()
      console.log('app_log - insert')
      return jsonValue;
    } catch (E) {
      console.log(E)
      return E;
    }
  }
}