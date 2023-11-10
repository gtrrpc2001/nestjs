import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parentsService } from 'src/service/parents.service';
import { parentsDTO } from '../dto/parents.dto';
import { staticConfigValue } from 'src/config/staticConfigValue';
//import { ConfigService } from '@nestjs/config';

@Controller('mslparents')
@ApiTags('mslparents')
export class parentsController {
  constructor(private readonly parentsService: parentsService,
    //private configService:ConfigService
    ) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: parentsDTO): Promise<string> {     
    return await this.parentsService.postParent(body);
  }
  @Get("/getTest")
 async getAll(@Query('eq') eq: string[]): Promise<boolean> {            
    return true;   
  }

  @Get("/Test")
 async post(): Promise<string> {      
  //let path = staticConfigValue.getFirebase_sdk(this.configService).path
  //  console.log(path)        
   // return path;   
   return '';
  }
}