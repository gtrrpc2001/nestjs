import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from '../service/sms.service';
import { UserEntity } from '../entity/user.entity';
import { smsController } from '../controller/sms.controller';
import { smsEntity } from '../entity/sms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachConfigService } from '../service/cache.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([smsEntity, UserEntity]),
        //     CacheModule.register({ 
        //     ttl: 5000, // 시간(밀리초)
        //     max: 1000 , // 캐시에 담길 최대 데이터 개수
        //     isGlobal: true, // 캐시모듈을 전역설정
        // }),
        CacheModule.registerAsync({ isGlobal: true, useClass: CachConfigService, inject: [CachConfigService] })
    ],
    providers: [
        SmsService
    ],
    controllers: [smsController]
})
export class smsModule { }
