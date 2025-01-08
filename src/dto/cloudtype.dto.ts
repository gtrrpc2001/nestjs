import { IsNumber, IsOptional, IsString } from "class-validator";

export class CloudTypeDTO {

    @IsString()
    readonly projectName: string;

    @IsString()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly status: string;

    @IsString()
    @IsOptional()
    readonly link: string;

    @IsOptional()
    @IsString()
    readonly aka: string;
}