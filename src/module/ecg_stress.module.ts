import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ecg_stressController } from "../controller/ecg_stress.controller";
import { ecg_stressEntity } from "../entity/ecg_stress.entity";
import { ecg_stressService } from "../service/ecg_stress.service";
import { db } from "src/clsfunc/commonfunc";
import { Test_stressService } from "src/service/test.service/test.stress.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([ecg_stressEntity], db.deploy),
        TypeOrmModule.forFeature([ecg_stressEntity], db.test)
    ],
    controllers: [ecg_stressController],
    providers: [ecg_stressService, Test_stressService]
})
export class ecg_stressModule { }