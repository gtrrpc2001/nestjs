import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ecg_byteController } from "../controller/ecg_byte.controller";
import { ecg_byteEntity } from "../entity/ecg_byte.entity";
import { ecg_raw_history_lastEntity } from "../entity/ecg_raw_history_last.entity";
import { ecg_byteService } from "../service/ecg_byte.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_byteEntity, ecg_raw_history_lastEntity])
    ],
    controllers: [ecg_byteController],
    providers: [ecg_byteService]
})
export class ecg_byteModule { }