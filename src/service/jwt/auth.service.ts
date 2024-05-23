import {JwtService} from '@nestjs/jwt'
import { 인원_목록DTO } from 'src/dto/user.dto'
import { Payload } from 'src/interface/payload'

export class AuthService{
    constructor(
        private jwtService:JwtService
    ){}

    async validateUser(body:인원_목록DTO):Promise<{accessToken: string} | undefined>{

        // 유저 이메일 과 비밀번호로 체크 후
        const email = ''
        const payload:Payload = {email:email}
        return {accessToken: this.jwtService.sign(payload)}
    }

    async tokenValidateUser(payload:Payload):Promise<any>{
        //토큰 검증
        payload.email
        return 
    }
}