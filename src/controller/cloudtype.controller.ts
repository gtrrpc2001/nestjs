import { Controller, Put, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { decrypt } from 'src/clsfunc/secertFunc';
import { CloudTypeDTO } from 'src/dto/cloudtype.dto';
import { CloudTypeService } from 'src/service/cloudtype.service';


@Controller('CloudType')
@ApiTags('CloudType')
export class CloudTypeController {
    constructor(private readonly cloudTypeService: CloudTypeService) { }
    @Post("/stat")
    async stat() {
        return await this.cloudTypeService.stat();
    }

    @Post("/start")
    async start(@Body() encryptData: { data: string }) {
        const body = decrypt<CloudTypeDTO>(encryptData.data)
        return await this.cloudTypeService.start(body);
    }

    @Post("/stop")
    async stop(@Body() encryptData: { data: string }) {
        const body = decrypt<CloudTypeDTO>(encryptData.data)
        return await this.cloudTypeService.stop(body);
    }
}