import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { app_logController } from '../controller/app_log.controller';
import { app_logEntity } from '../entity/app_log.entity';
import { app_logService } from '../service/app_log.service';
import { db } from 'src/clsfunc/commonfunc';


@Module({
    imports: [
        TypeOrmModule.forFeature([app_logEntity], db.deploy)
    ],
    controllers: [app_logController],
    providers: [app_logService]
})
export class app_logModule { }