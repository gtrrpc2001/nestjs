import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital_patientService } from '../service/hospital_patient.service';
import { Hospital_patientController } from '../controller/hospital_patient.controller';
import { Hospital_patientEntity, Hospital_patient_logEntity } from '../entity/hospital_patient.entity';
import { db } from 'src/clsfunc/commonfunc';

@Module({
    imports: [
        TypeOrmModule.forFeature([Hospital_patientEntity, Hospital_patient_logEntity], db.deploy),
    ],
    controllers: [Hospital_patientController],
    providers: [Hospital_patientService],
})
export class Hospital_patientModule { }
