import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parents')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    idx: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    qty: number;

    @Column({ type: 'varchar' })
    desc: string;

    @Column({ type: 'tinyint' })
    isdeleted: number;
}