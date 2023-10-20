import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('인원_목록')
export class 인원_목록Entity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    구분:string;

    @Column({type:'varchar'})
    업체번호:string;

    @Column({type:'varchar'})
    업체명:string;

    @Column({type:'varchar'})
    부서:string;

    @Column({type:'varchar'})
    직급:string;
    
    @Column({type:'varchar'})
    성명:string;

    @Column({type:'varchar'})
    핸드폰:string;

    @Column({type:'varchar'})
    전화번호:string;

    @Column({type:'varchar'})
    이메일:string;

    @Column({type:'varchar'})
    주소:string;
    
    @Column({type:'varchar'})
    아이디:string;         

    @Column({type:'text'})
    패스워드키:string;
    
    @Column({type:'text'})
    패스워드키임시:string;

    @Column({type:'varchar'})
    성별:string;

    @Column({type:'varchar'})
    신장:string;

    @Column({type:'varchar'})
    몸무게:string;

    @Column({type:'varchar'})
    나이:string;
    
    @Column({type:'date'})
    생년월일:string;

    @Column({type:'varchar'})
    업무:string;   

    @Column({type:'varchar'})
    메모:string;

    @Column({type:'varchar'})
    권한:string;     

    @Column({type:'date'})
    사용기간시작:string;

    @Column({type:'date'})
    사용기간종료:string;

    @Column({type:'varchar'})
    승인여부:string;

    @Column({type:'varchar'})
    근로계약서서명여부:string;

    @Column({type:'datetime'})
    근무시작시각:string;

    @Column({type:'datetime'})
    근무종료시각:string;

    @Column({type:'int'})
    로그인시도:Int32;
    
    @Column({type:'int'})
    잠금:Int32;

    @Column({type:'datetime'})
    잠금시각:string; 

    @Column({type:'datetime'})
    가입일:string;

    @Column({type:'int'})
    설정_수면시작:Int32;

    @Column({type:'int'})
    설정_수면종료:Int32;  

    @Column({type:'double'})
    설정_활동BPM:Double;

    @Column({type:'double'})
    설정_일걸음:Double;

    @Column({type:'double'})
    설정_일거리:Double;

    @Column({type:'double'})
    설정_일활동칼로리:Double;

    @Column({type:'double'})
    설정_일칼로리:Double;

    @Column({type:'int'})
    알림_sms:Int32;

    @Column({type:'double'})
    시간차이:Double;

    @Column({type:'varchar'})
    보호대상아이디:string; 

    @Column({type:'varchar'})
    보호자연락처:string; 

    @Column({type:'varchar'})
    destid1:string; 

    @Column({type:'varchar'})
    destid2:string; 

    @Column({type:'varchar'})
    destid3:string;  
}