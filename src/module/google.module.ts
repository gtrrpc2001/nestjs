import { Module} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleController } from 'src/controller/google.controller';
import { GoogleService } from 'src/service/google/google.service';
import { GoogleStrategy } from 'src/service/google/googleStrategy.service';
import { SessionSerializer } from 'src/service/google/sessionSerializer';

@Module({
    imports:[
        PassportModule.register({
            session:true,
        })
    ],
    controllers:[GoogleController],
    providers:[GoogleService,GoogleStrategy,SessionSerializer]
})

export class GoogleModule{}