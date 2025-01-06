import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from '../service/sms.service';
import { UserEntity } from '../entity/user.entity';
import { smsController } from '../controller/sms.controller';
import { smsEntity } from '../entity/sms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachConfigService } from '../service/cache.service';
import { db } from 'src/clsfunc/commonfunc';



@Module({
    imports: [
        TypeOrmModule.forFeature([smsEntity, UserEntity], db.deploy),
        CacheModule.registerAsync({ isGlobal: true, useClass: CachConfigService, inject: [CachConfigService] })
    ],
    providers: [
        SmsService
    ],
    controllers: [smsController]
})
export class smsModule { }
