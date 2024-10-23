import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from '../service/google/google.service';
import { GoogleAuthGuard } from '../service/google/googleAuthGuard';

@Controller('mslgoogle')
@ApiTags('mslparents')
export class GoogleController {
    constructor(
        private readonly googleservice: GoogleService
    ) { }

    @Get('open')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {

    }

    @Get('redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirent(@Req() req) {
        return await this.googleservice.validateAndSaveUser(req)
    }

    //     @UseGuards(GoogleAuthGuard)
    //   @Get('google/callback')
    //   async googleAuthCallback(
    //     @Users() user: ValidateUserForGoogleInboundInputDto,
    //   ) {
    //     const googleId = await this.authControllerInboundPort.validateUserForGoogle(
    //       user,
    //     );
    //     console.log(user);

    //     return { user };
    //   }
}
