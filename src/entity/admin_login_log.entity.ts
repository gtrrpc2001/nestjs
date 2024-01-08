import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('admin_login_log')
export class admin_login_logEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    gubun:string;

    @Column({type:'varchar'})
    eq:string;

    @Column({type:'varchar'})
    eqname:string;

    @Column({type:'date'})
    writetime:string;
    
    @Column({type:'varchar'})
    activity:string;
<<<<<<< HEAD
}
=======
}
>>>>>>> 5fa4d26c8137199d850b4a0a215f844eb99fbd96
