import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { admin_login_logController } from '../controller/admin_login_log.controller';
import { admin_login_logEntity } from '../entity/admin_login_log.entity';
import { admin_login_logService } from '../service/admin_login_log.service';
import { db } from 'src/clsfunc/commonfunc';


@Module({
    imports: [
        TypeOrmModule.forFeature([admin_login_logEntity], db.deploy)
    ],
    controllers: [admin_login_logController],
    providers: [admin_login_logService]
})
export class admin_login_logModule { }