import { ecg_csv_ecgdata_arrModule } from "src/module/ecg_csv_ecgdata_arr.module";
import { ecg_csv_bpmdayModule } from "src/module/ecg_csv_bpmday.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_datadayModule } from "src/module/ecg_csv_dataday.module";
import { ecg_csv_ecgdataModule } from "src/module/ecg_csv_ecgdata.module";
import { ecg_raw_history_lastModule } from "src/module/ecg_raw_history_last.module";
import { admin_login_logModule } from "src/module/admin_login_log.module";
import { parentsModule } from "src/module/parents.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MySqlMslConfigService } from "src/service/mysqlconfig.service";
import { appversionModule } from "src/module/appversion.module";
import { 인원_목록Module } from "src/module/인원_목록.module";
import { ecg_byteModule } from "src/module/ecg_byte.module";
import { smsModule } from "src/module/sms.module";
import { app_logModule } from "src/module/app_log.module";
import { app_bleModule } from "src/module/app_ble.module";



export class allModule{

    static appImport = [
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env',
        }),

        TypeOrmModule.forRootAsync({
            useClass:MySqlMslConfigService,
            inject:[MySqlMslConfigService]
        }),
            
        ecg_csv_ecgdata_arrModule,ecg_csv_bpmdayModule,ecg_csv_datadayModule,
        ecg_csv_ecgdataModule,ecg_raw_history_lastModule,인원_목록Module,admin_login_logModule,
        parentsModule,appversionModule,ecg_byteModule,smsModule,app_logModule,app_bleModule
        
    ]
}
    


