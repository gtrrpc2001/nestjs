import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StockEntity } from './stock.entity';

@Entity('stock_amount_history')
export class StockHistoryEntity {
    @PrimaryGeneratedColumn("increment", {})
    idx: number;

    // @ManyToOne(() => StockEntity, (stock) => stock.idx)
    // @JoinColumn({ name: 'stocknumber' })
    // stocknumber: StockEntity;
    @Column({ type: 'int' })
    @ManyToOne(() => StockEntity, (stock) => stock.idx)
    @JoinColumn({ name: 'stocknumber' })
    stocknumber: number;

    @Column({ type: 'int' })
    qty: number;

    @Column({ type: 'tinyint' })
    is_add: number;

    @Column({ type: 'datetime' })
    writetime: string;

    @Column({ type: 'varchar' })
    desc: string;

    @Column({ type: 'text' })
    writer: string;
}

