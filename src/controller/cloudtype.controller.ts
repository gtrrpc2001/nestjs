import { Controller, Put, Post, Body, Get, Options, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { decrypt, encrypt } from 'src/clsfunc/crypto-js';
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
        const statData = await this.cloudTypeService.stat();
        const data = encrypt(statData)
        return data;
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