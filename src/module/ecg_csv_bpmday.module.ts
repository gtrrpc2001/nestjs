import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_bpmdayController } from '../controller/ecg_csv_bpmday.controller';
import { ecg_csv_bpmdayEntity } from '../entity/ecg_csv_bpmday.entity';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_csv_ecgdata_arr.entity';
import { ecg_raw_history_lastEntity } from '../entity/ecg_raw_history_last.entity';
import { ecg_csv_bpmdayService } from '../service/ecg_csv_bpmday.service';
import { db } from 'src/clsfunc/commonfunc';
import { Test_BpmService } from 'src/service/test.service/test.bpm.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_csv_bpmdayEntity, ecg_raw_history_lastEntity, ecg_csv_ecgdata_arrEntity], db.deploy),
        TypeOrmModule.forFeature([ecg_csv_bpmdayEntity, ecg_raw_history_lastEntity, ecg_csv_ecgdata_arrEntity], db.test)
    ],
    controllers: [ecg_csv_bpmdayController],
    providers: [ecg_csv_bpmdayService, Test_BpmService]
})
export class ecg_csv_bpmdayModule { }