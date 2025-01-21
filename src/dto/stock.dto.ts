import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StockDTO {

    @IsNumber()
    @IsOptional()
    readonly idx: number;

    @IsString()
    readonly name: string;

    @IsNumber()
    @IsOptional()
    readonly qty: number;

    @IsString()
    @IsOptional()
    readonly desc: string;

    @IsNumber()
    readonly isdeleted: number;
}

export class InsertStockDTO {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly qty: number;

    @IsString()
    readonly writetime: string;

    @IsString()
    readonly desc: string;
}
