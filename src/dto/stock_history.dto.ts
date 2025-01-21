import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StockHistoryDTO {

    @IsNumber()
    readonly idx: number;

    @IsNumber()
    readonly stocknumber: number;

    @IsNumber()
    readonly qty: number;

    @IsNumber()
    readonly is_add: number;

    @IsString()
    readonly writetime: string;

    @IsString()
    readonly desc: string;

    @IsString()
    readonly writer: string;
}
