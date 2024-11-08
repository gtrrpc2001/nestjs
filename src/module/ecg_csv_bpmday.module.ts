import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_bpmdayController } from '../controller/ecg_csv_bpmday.controller';
import { ecg_csv_bpmdayEntity } from '../entity/ecg_csv_bpmday.entity';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_csv_ecgdata_arr.entity';
import { ecg_raw_history_lastEntity } from '../entity/ecg_raw_history_last.entity';
import { ecg_csv_bpmdayService } from '../service/ecg_csv_bpmday.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_csv_bpmdayEntity, ecg_raw_history_lastEntity, ecg_csv_ecgdata_arrEntity])
    ],
    controllers: [ecg_csv_bpmdayController],
    providers: [ecg_csv_bpmdayService]
})
export class ecg_csv_bpmdayModule { }