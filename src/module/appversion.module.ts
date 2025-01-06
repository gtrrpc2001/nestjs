import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { appversionController } from "../controller/appversion.controller";
import { appversionEntity } from "../entity/appversion.entity";
import { appversionService } from "../service/appversion.service";
import { db } from "src/clsfunc/commonfunc";

@Module({
    imports: [
        TypeOrmModule.forFeature([appversionEntity], db.deploy)
    ],
    controllers: [appversionController],
    providers: [appversionService]
})
export class appversionModule { }