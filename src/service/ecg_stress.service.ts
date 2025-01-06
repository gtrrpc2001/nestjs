import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
} from 'typeorm';
import { ecg_stressEntity } from 'src/entity/ecg_stress.entity';
import { GetStressData } from './common.service.function/stress.common.function';
import { db } from 'src/clsfunc/commonfunc';

@Injectable()
export class ecg_stressService {
  constructor(
    @InjectRepository(ecg_stressEntity, db.deploy)
    private ecg_stressRepository: Repository<ecg_stressEntity>,
  ) { }

  async getStressData(eq: string, sDate: string, eDate: string): Promise<any> {
    return await GetStressData(this.ecg_stressRepository, eq, sDate, eDate);
  }
}
