import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_datadayController } from '../controller/ecg_csv_dataday.controller';
import { ecg_csv_datadayEntity } from '../entity/ecg_csv_dataday.entity';
import { ecg_csv_datadayService } from '../service/ecg_csv_dataday.service';
import { db } from 'src/clsfunc/commonfunc';
import { Test_DayDataService } from 'src/service/test.service/test.dayData.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_csv_datadayEntity], db.deploy),
        TypeOrmModule.forFeature([ecg_csv_datadayEntity], db.test)
    ],
    controllers: [ecg_csv_datadayController],
    providers: [ecg_csv_datadayService, Test_DayDataService]
})
export class ecg_csv_datadayModule { }