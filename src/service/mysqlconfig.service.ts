import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MySqlMsl_testConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const options: TypeOrmModuleOptions = {
            type: 'mysql',
            host: this.configService.get<string>('HOST'),
            port: +this.configService.get<number>('PORT'),
            username: this.configService.get<string>('NAME'),
            password: this.configService.get<string>('PASSWORD'),
            database: this.configService.get<string>('TDATABASE'),
            entities: ['dist/entity/*.entity.{js,ts}'],
            synchronize: false,
            dateStrings: true,
        };
        return options;
    }
}

@Injectable()
export class MySqlMslConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('HOST'),
            port: +this.configService.get<number>('PORT'),
            username: this.configService.get<string>('NAME'),
            password: this.configService.get<string>('PASSWORD'),
            database: this.configService.get<string>('DATABASE'),
            entities: ['dist/entity/*.entity.{js,ts}'],
            synchronize: false,
            //timezone:'Asia/Seoul',
            dateStrings: true
        }
    }
}