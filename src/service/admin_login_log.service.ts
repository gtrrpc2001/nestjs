import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { admin_login_logEntity } from '../entity/admin_login_log.entity';
import { admin_login_logDTO } from '../dto/admin_login_log.dto';
import { db } from 'src/clsfunc/commonfunc';

@Injectable()
export class admin_login_logService {
  constructor(@InjectRepository(admin_login_logEntity, db.deploy) private admin_login_logRepository: Repository<admin_login_logEntity>) { }

  async LogInsert(body: admin_login_logDTO): Promise<any> {
    var boolResult = false
    try {
      const result = await this.admin_login_logRepository.createQueryBuilder()
        .insert()
        .into(admin_login_logEntity)
        .values([{
          gubun: body.gubun, eq: body.eq, eqname: body.eqname, writetime: body.writetime, activity: body.activity
        }])
        .execute()
      boolResult = true
      var jsonValue = 'result = ' + boolResult.toString()
      console.log('admin - insert')
      return jsonValue;
    } catch (E) {
      console.log(E)
      return E;
    }
  }
}