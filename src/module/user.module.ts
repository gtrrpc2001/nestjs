import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { delete_user_last_logEntity, ecg_raw_history_lastEntity } from 'src/entity/ecg_raw_history_last.entity';
import { parentsEntity } from 'src/entity/parents.entity';
import { DeleteUserLogEntity, UserEntity } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';



@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity,ecg_raw_history_lastEntity,parentsEntity,DeleteUserLogEntity,delete_user_last_logEntity])
    ],
    controllers:[UserController],
    providers:[UserService]
})
export class UserModule {}