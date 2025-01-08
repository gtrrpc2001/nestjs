import { Module } from "@nestjs/common";
import { CloudTypeController } from "src/controller/cloudtype.controller";
import { CloudTypeService } from "src/service/cloudtype.service";

@Module({
    imports: [],
    controllers: [CloudTypeController],
    providers: [CloudTypeService]
})
export class CloudTypeModule { }