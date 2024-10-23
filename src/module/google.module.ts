import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleController } from '../controller/google.controller';
import { GoogleService } from '../service/google/google.service';
import { GoogleStrategy } from '../service/google/googleStrategy.service';
import { SessionSerializer } from '../service/google/sessionSerializer';

@Module({
    imports: [
        PassportModule.register({
            session: true,
        })
    ],
    controllers: [GoogleController],
    providers: [GoogleService, GoogleStrategy, SessionSerializer]
})

export class GoogleModule { }