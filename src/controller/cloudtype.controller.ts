import { Controller, Put, Post, Body, Get, Options, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CloudTypeDTO } from 'src/dto/cloudtype.dto';
import { CloudTypeGuard } from 'src/guard/cloudtype.guard';
import { CloudTypeService } from 'src/service/cloudtype.service';

@UseGuards(CloudTypeGuard)
@Controller('CloudType')
@ApiTags('CloudType')
export class CloudTypeController {
    constructor(private readonly cloudTypeService: CloudTypeService) { }
    // @Options

    @Post("/stat")
    async stat() {
        return await this.cloudTypeService.stat();
    }

    @Post("/start")
    async start(@Body() body: CloudTypeDTO) {
        // const body = decrypt<CloudTypeDTO>(encryptData.data)
        return await this.cloudTypeService.start(body);
    }

    @Post("/stop")
    async stop(@Body() body: CloudTypeDTO) {
        // const body = decrypt<CloudTypeDTO>(encryptData.data)
        return await this.cloudTypeService.stop(body);
    }
}