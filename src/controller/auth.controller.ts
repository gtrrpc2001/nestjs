// import { Request,Response } from "@nestjs/common";
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request,Response } from "express";
import { 인원_목록DTO } from "src/dto/user.dto";
import { AuthService } from "src/service/jwt/auth.service";

@Controller('mslauth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('/refreshToken')
    async signIn(@Body() body:인원_목록DTO, @Res() res:Response):Promise<any>{
        const jwt = await this.authService.validateUser(body);              
        res.setHeader('Authorization','Bearer ' + jwt.accessToken);
        return res.json(jwt);
    }

    @Get('/authenticate')
    @UseGuards(AuthGuard())
    isAuthenTicated(@Req() req:Request):any{
        const user = req.user;
        return user
    }
}