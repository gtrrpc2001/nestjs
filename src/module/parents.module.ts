import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parentsController } from '../controller/parents.controller';
import { parentsEntity } from '../entity/parents.entity';
import { parentsService } from '../service/parents.service';
import { db } from 'src/clsfunc/commonfunc';



@Module({
    imports: [
        TypeOrmModule.forFeature([parentsEntity], db.deploy)
    ],
    controllers: [parentsController],
    providers: [parentsService]
})
export class parentsModule { }