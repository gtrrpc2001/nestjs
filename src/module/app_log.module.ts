import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { app_logController } from '../controller/app_log.controller';
import { app_logEntity } from '../entity/app_log.entity';
import { app_logService } from '../service/app_log.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([app_logEntity])
    ],
    controllers: [app_logController],
    providers: [app_logService]
})
export class app_logModule { }