import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegistStockQtyDTO {
    @IsString()
    readonly desc: string;

    @IsNumber()
    @IsOptional()
    readonly qty: number;

    @IsString()
    @IsOptional()
    readonly writetime: string;
}
