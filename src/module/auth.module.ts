import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/jwt/auth.service'
import { JwtStrategy } from '../service/jwt/jwtStrategy'


@Module({
    imports: [
        JwtModule.register({
            secret: 'SECRET',
            signOptions: { expiresIn: '300s' }
        }),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    exports: [],
    controllers: [AuthController],
    providers: [AuthService, JwtModule, JwtStrategy]
})

export class AuthModule { }