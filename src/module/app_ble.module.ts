import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { app_bleController } from '../controller/app_ble.controller';
import { app_bleEntity } from '../entity/app_ble.entity';
import { parentsEntity } from '../entity/parents.entity';
import { app_bleService } from '../service/app_ble.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([app_bleEntity, parentsEntity])
    ],
    controllers: [app_bleController],
    providers: [app_bleService]
})
export class app_bleModule { }