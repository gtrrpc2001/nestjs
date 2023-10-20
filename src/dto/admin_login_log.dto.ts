import { IsNumber,IsOptional,IsString } from "class-validator";


export class admin_login_logDTO{
    @IsString()
    readonly kind: string;

    @IsString()
    @IsOptional()
    readonly 구분:string;
    
    @IsString()    
    readonly 아이디:string;
    
    @IsString()
    @IsOptional()
    readonly 성명:string;

    @IsString()    
    readonly 날짜:string;
    
    @IsString()    
    readonly 활동:string;
}