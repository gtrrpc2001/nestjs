import { Controller, Get,Post,Body,Query, Redirect} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserService } from 'src/service/user.service';

@Controller('msl')
@ApiTags('msl')
export class UserController {
  constructor(private readonly userService: UserService) {}  

  @Get('redirect')
  @Redirect('')
  async redirect(): Promise<any>{
    return ''
  }

  @Post("/api_getdata")
 async postAll(    
   @Body() body: UserDTO): Promise<any> {        
    return await this.userService.gubunKind(body);
  } 

  @Get("/CheckIDDupe")
 async getCheckIDDupe(       
   @Query('empid') empid:string): Promise<string> {       
    return await this.userService.checkIDDupe(empid);
  }

  @Get("/findID")
 async getFindID(       
   @Query('성명') name:string,
   @Query('핸드폰') phone:string,
   @Query('생년월일') birth:string): Promise<string> {       
    return await this.userService.findID(name,phone,birth);
  }

  @Get("/Profile")
 async getProfile(       
   @Query('empid') empid:string): Promise<string> {     
    return await this.userService.getProfile(empid);
  }

  @Get("/CheckLogin")
 async getCheckLogin(       
   @Query('empid') empid:string,
   @Query('pw') pw:string,
   @Query('phone') phone:string,
   @Query('token') token:string,
   @Query('destroy') destroy:boolean
   ): Promise<string> {          
    return await this.userService.checkLogin(empid,pw,phone,token,destroy);
  }
  
  @Get("/checkPhone")
 async checkPhone(       
   @Query('phone') phone:string): Promise<string> {     
    return await this.userService.checkPhone(phone);
  }

  @Get("/appKey")
 async getAppKey(       
   @Query('empid') empid:string): Promise<string> {
     return await this.userService.getAppKey(empid);     
  }

  @Post("/postTest")
 async postTest(    
   @Body() body: UserDTO): Promise<any> {        
    return await this.userService.lastDelete(body.eq);
  } 
    
}