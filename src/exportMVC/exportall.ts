import { ecg_csv_ecgdata_arrModule } from '../module/ecg_csv_ecgdata_arr.module';
import { ecg_csv_bpmdayModule } from '../module/ecg_csv_bpmday.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_datadayModule } from '../module/ecg_csv_dataday.module';
import { ecg_raw_history_lastModule } from '../module/ecg_raw_history_last.module';
import { admin_login_logModule } from '../module/admin_login_log.module';
import { parentsModule } from '../module/parents.module';
import { ConfigModule } from '@nestjs/config';
import { MySqlMslConfigService } from '../factory/mysqlconfig.service';
import { appversionModule } from '../module/appversion.module';
import { UserModule } from '../module/user.module';
import { ecg_byteModule } from '../module/ecg_byte.module';
import { smsModule } from '../module/sms.module';
import { app_logModule } from '../module/app_log.module';
import { app_bleModule } from '../module/app_ble.module';
import { AuthModule } from '../module/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusService } from 'factory/prometheus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from 'factory/mongoconfig.service';
import { ExerciseModule } from 'module/exercise.module';
import { GoogleModule } from 'module/google.module';
import { AppleModule } from 'module/apple.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticFactory } from 'factory/serveStatic.factory';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from 'factory/redis.factory';
import { ecg_stressModule } from 'module/ecg_stress.module';

export class allModule {
  static appImport = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMslConfigService,
      inject: [MySqlMslConfigService],
    }),

    MongooseModule.forRootAsync({ useClass: MongoConfig, inject: [MongoConfig] }),
    PrometheusModule.registerAsync({ global: true, useClass: PrometheusService }),
    ServeStaticModule.forRootAsync({ useClass: ServeStaticFactory }),
    RedisModule.forRootAsync({
      useClass: RedisConfig,
      inject: [RedisConfig]
    }),
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
    AuthModule,
    ExerciseModule,
    GoogleModule,
    AppleModule,
    ecg_stressModule

    // RedisSessionModule
  ];
}
