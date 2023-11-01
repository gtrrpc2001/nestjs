import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { 인원_목록DTO } from '../dto/인원_목록.dto';
import { 인원_목록Service } from 'src/service/인원_목록.service';

@Controller('msl')
@ApiTags('msl')
export class 인원_목록Controller {
  constructor(private readonly 인원_목록Service: 인원_목록Service) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: 인원_목록DTO): Promise<any> {        
    return this.인원_목록Service.gubunKind(body);
  }
  checkIDDupe

  @Get("/CheckIDDupe")
 async getCheckIDDupe(       
   @Query('empid') empid:string): Promise<string> {       
    return this.인원_목록Service.checkIDDupe(empid);
  }

  @Get("/findID")
 async getFindID(       
   @Query('성명') name:string,
   @Query('핸드폰') phone:string,
   @Query('생년월일') birth:string): Promise<string> {       
    return this.인원_목록Service.findID(name,phone,birth);
  }

  @Get("/Profile")
 async getProfile(       
   @Query('empid') empid:string): Promise<string> {     
    return this.인원_목록Service.getProfile(empid);
  }

  @Get("/CheckLogin")
 async getCheckLogin(       
   @Query('empid') empid:string,
   @Query('pw') pw:string,
   @Query('phone') phone:string,
   @Query('token') token:string): Promise<string> {     
    return this.인원_목록Service.checkLogin(empid,pw,phone,token);
  }  

  @Get("/test")
 async getTest(       
   @Query('empid') empid:string,
   @Query('pw') pw:string,
   @Query('phone') phone:string,
   @Query('token') token:string): Promise<any> {
    return this.인원_목록Service.CheckLoginGuardianApp(empid,pw,phone,token);
  }
}