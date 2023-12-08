import { IsNumber,IsOptional,IsString } from "class-validator";
import { Double,Int32 } from "typeorm";

export class 인원_목록DTO{
    
    @IsOptional()
    @IsString()
    readonly kind: string;
    
    @IsString()
    readonly 아이디:string;

    @IsOptional()
    @IsString()
    readonly 패스워드키:string;
    
    @IsOptional()
    @IsString()
    readonly 성명:string;

    @IsOptional()
    @IsString()
    readonly 이메일:string;

    @IsOptional()
    @IsString()
    readonly 핸드폰:string;    

    @IsOptional()
    @IsString()
    readonly 성별:string;

    @IsOptional()
    @IsString()
    readonly 신장:string;

    @IsOptional()
    @IsString()
    readonly 몸무게:string;

    @IsOptional()
    @IsString()
    readonly 나이:string;
    
    @IsOptional()
    @IsString()
    readonly 생년월일:string;
    
    @IsOptional()
    @IsString()
    readonly 설정_수면시작:string;

    @IsOptional()
    @IsString()
    readonly 설정_수면종료:string;

    @IsOptional()
    @IsString()
    readonly 설정_활동BPM:string;

    @IsOptional()
    @IsString()
    readonly 설정_일걸음:string;

    @IsOptional()
    @IsString()
    readonly 설정_일거리:string;

    @IsOptional()
    @IsString()
    readonly 설정_일활동칼로리:string;

    @IsOptional()
    @IsString()
    readonly 설정_일칼로리:string;

    @IsOptional()
    @IsString()
    readonly 알림_sms:string;

    @IsOptional()
    @IsString()
    readonly 시간차이:string;
}