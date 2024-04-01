import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from 'src/controller/auth.controller'
import { AuthService } from 'src/service/jwt/auth.service'
import { JwtStrategy } from 'src/service/jwt/jwtStrategy'


@Module({
    imports:[                
        JwtModule.register({
            secret:'SECRET',
            signOptions:{expiresIn:'300s'}
        }),
        PassportModule.register({defaultStrategy:'jwt'})
    ],    
    exports:[],
    controllers:[AuthController],
    providers:[AuthService,JwtModule,JwtStrategy]
})

export class AuthModule {}