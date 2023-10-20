import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('admin_login_log')
export class admin_login_logEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    구분:string;

    @Column({type:'varchar'})
    아이디:string;

    @Column({type:'varchar'})
    성명:string;

    @Column({type:'datetime'})
    날짜:string;
    
    @Column({type:'varchar'})
    활동:string;
}