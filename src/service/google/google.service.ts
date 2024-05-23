import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class GoogleService{
    constructor(
        private readonly userservice:UserService
    ){

    }

    async validateAndSaveUser(info:any):Promise<any>{
        const {email,refreshToken} = info
        const newUser = await this.userservice.checkIDDupe(email);

        if(newUser){
            //const newUser = await this.userService.createSocialUser(socialLoginInfoDto);
            // const updateUser = await this.userService.updateSocialUserInfo(newUser.id);
            // return updateUser;
        }else{
            // if (existingUser.socialProvider !== Provider.GOOGLE) {
            //     return {
            //       existingUser: existingUser,
            //       msg: '해당 이메일을 사용중인 계정이 존재합니다.'
            //     }
            //   } else {
            //     const updateUserWithRefToken: User = await this.userService.updateSocialUserRefToken(existingUser.id, refreshToken);
            //     return updateUserWithRefToken;
            // }
        }
    }

    async findUserById(id:string):Promise<string>{
       const user =  await this.userservice.getProfile(id)
       return user
    }
}