import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_ecgdata_arrController } from 'src/controller/ecg_csv_ecgdata_arr.controller';
import { ecg_csv_ecgdata_arrEntity } from 'src/entity/ecg_csv_ecgdata_arr.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { 인원_목록Entity } from 'src/entity/인원_목록.entity';
import { ecg_csv_ecgdata_arrService } from 'src/service/ecg_csv_ecgdata_arr.service';


@Module({
    imports:[
        TypeOrmModule.forFeature([ecg_csv_ecgdata_arrEntity,parentsEntity,인원_목록Entity])
    ],
    controllers:[ecg_csv_ecgdata_arrController],
    providers:[ecg_csv_ecgdata_arrService,]
})
export class ecg_csv_ecgdata_arrModule {}