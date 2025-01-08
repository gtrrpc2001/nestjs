import { Controller, Put, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
    async start(@Body() body: CloudTypeDTO) {
        return await this.cloudTypeService.start(body);
    }

    @Post("/stop")
    async stop(
        @Body() body: CloudTypeDTO) {
        return await this.cloudTypeService.stop(body);
    }
}