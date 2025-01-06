import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_ecgdata_arrController } from '../controller/ecg_csv_ecgdata_arr.controller';
import { ecg_byteEntity } from '../entity/ecg_byte.entity';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_csv_ecgdata_arr.entity';
import { parentsEntity } from '../entity/parents.entity';
import { UserEntity } from '../entity/user.entity';
import { ecg_csv_ecgdata_arrService } from '../service/ecg_csv_ecgdata_arr.service';
import { db } from 'src/clsfunc/commonfunc';
import { Test_ArrService } from 'src/service/test.service/test.arr.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_csv_ecgdata_arrEntity, ecg_byteEntity, parentsEntity, UserEntity], db.deploy),
        TypeOrmModule.forFeature([ecg_csv_ecgdata_arrEntity, ecg_byteEntity, parentsEntity, UserEntity], db.test)
    ],
    controllers: [ecg_csv_ecgdata_arrController],
    providers: [ecg_csv_ecgdata_arrService, Test_ArrService]
})
export class ecg_csv_ecgdata_arrModule { }