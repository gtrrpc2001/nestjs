import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { appversionController } from "../controller/appversion.controller";
import { appversionEntity } from "../entity/appversion.entity";
import { appversionService } from "../service/appversion.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([appversionEntity])
    ],
    controllers: [appversionController],
    providers: [appversionService]
})
export class appversionModule { }