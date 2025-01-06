import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_raw_history_lastController } from '../controller/ecg_raw_history_last.controller';
import { ecg_csv_datadayEntity } from '../entity/ecg_csv_dataday.entity';
import { ecg_raw_history_lastEntity } from '../entity/ecg_raw_history_last.entity';
import { ecg_raw_history_lastService } from '../service/ecg_raw_history_last.service';
import { db } from 'src/clsfunc/commonfunc';
import { Test_History_lastService } from 'src/service/test.service/test.last.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_raw_history_lastEntity, ecg_csv_datadayEntity], db.deploy),
        TypeOrmModule.forFeature([ecg_raw_history_lastEntity, ecg_csv_datadayEntity], db.test)
    ],
    controllers: [ecg_raw_history_lastController],
    providers: [ecg_raw_history_lastService, Test_History_lastService]
})
export class ecg_raw_history_lastModule { }