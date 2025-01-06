import { ecg_csv_ecgdata_arrModule } from '../module/ecg_csv_ecgdata_arr.module';
import { ecg_csv_bpmdayModule } from '../module/ecg_csv_bpmday.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_datadayModule } from '../module/ecg_csv_dataday.module';
import { ecg_raw_history_lastModule } from '../module/ecg_raw_history_last.module';
import { admin_login_logModule } from '../module/admin_login_log.module';
import { parentsModule } from '../module/parents.module';
import { ConfigModule } from '@nestjs/config';
import { MySqlMslConfigService, MySqlMsl_testConfigService } from '../service/mysqlconfig.service';
import { appversionModule } from '../module/appversion.module';
import { UserModule } from '../module/user.module';
import { ecg_byteModule } from '../module/ecg_byte.module';
import { smsModule } from '../module/sms.module';
import { app_logModule } from '../module/app_log.module';
import { app_bleModule } from '../module/app_ble.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusService } from '../service/prometheus.service';
import { ecg_stressModule } from '../module/ecg_stress.module';
import { Hospital_patientModule } from '../module/hospital_patient.module';
import { db } from 'src/clsfunc/commonfunc';





export class allModule {
  static appImport = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMsl_testConfigService,
      inject: [MySqlMsl_testConfigService],
      name: db.test
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMslConfigService,
      inject: [MySqlMslConfigService],
      name: db.deploy
    }),

    PrometheusModule.registerAsync({ global: true, useClass: PrometheusService }),
    ecg_csv_ecgdata_arrModule,
    ecg_csv_bpmdayModule,
    ecg_csv_datadayModule,
    ecg_raw_history_lastModule,
    UserModule,
    admin_login_logModule,
    parentsModule,
    appversionModule,
    ecg_byteModule,
    smsModule,
    app_logModule,
    app_bleModule,
    // GoogleModule,
    ecg_stressModule,
    Hospital_patientModule

    // RedisSessionModule
  ];
}
