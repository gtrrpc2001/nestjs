import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 인원_목록Controller } from 'src/controller/인원_목록.controller';
import { delete_user_last_logEntity, ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { DeleteUserLogEntity, 인원_목록Entity } from 'src/entity/인원_목록.entity';
import { 인원_목록Service } from 'src/service/인원_목록.service';



@Module({
    imports:[
        TypeOrmModule.forFeature([인원_목록Entity,ecg_raw_history_lastEntity,parentsEntity,DeleteUserLogEntity,delete_user_last_logEntity])
    ],
    controllers:[인원_목록Controller],
    providers:[인원_목록Service]
})
export class 인원_목록Module {}