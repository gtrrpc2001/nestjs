import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_raw_history_lastController } from '../controller/ecg_raw_history_last.controller';
import { ecg_csv_datadayEntity } from '../entity/ecg_csv_dataday.entity';
import { ecg_raw_history_lastEntity } from '../entity/ecg_raw_history_last.entity';
import { ecg_raw_history_lastService } from '../service/ecg_raw_history_last.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_raw_history_lastEntity, ecg_csv_datadayEntity])
    ],
    controllers: [ecg_raw_history_lastController],
    providers: [ecg_raw_history_lastService]
})
export class ecg_raw_history_lastModule { }