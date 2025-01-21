import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { db } from 'src/clsfunc/commonfunc';
import { StockEntity } from 'src/entity/stock.entity';
import { InsertStockDTO, StockDTO } from 'src/dto/stock.dto';
import { RegistStockQtyDTO } from 'src/dto/regist_stock_qty.dto';
import { StockHistoryEntity } from 'src/entity/stockhistory.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(StockEntity, db.deploy) private stockRepository: Repository<StockEntity>,
        @InjectRepository(StockHistoryEntity, db.deploy) private stockHistoryRepository: Repository<StockHistoryEntity>
    ) { }


    // 재고 목록 가져오기
    async get_stock_list(): Promise<StockDTO[]> {
        return await this.stockRepository.findBy({ isdeleted: 0 })
    }

    // 재고 기록 가져오기
    async get_stock_history(idx: number): Promise<StockHistoryEntity[]> {
        const result: StockHistoryEntity[] = await this.stockHistoryRepository.createQueryBuilder()
            .select('*')
            .where({ stocknumber: idx })
            .orderBy({ 'idx': 'DESC' })
            .getRawMany()
        return result
    }

    // 신규 재고 추가
    async insert_stock_menu(@Body() stock: Partial<InsertStockDTO>): Promise<{ stock: StockEntity, history: StockHistoryEntity } | { message: string }> {
        const new_stock = await this.stockRepository.save(stock);
        if (new_stock) {
            const new_history = await this.stockHistoryRepository.save(
                {
                    stocknumber: new_stock.idx,
                    qty: stock.qty,
                    is_add: 0,
                    desc: stock.desc,
                    writetime: stock.writetime,
                    writer: "admin"
                }
            )
            return { stock: new_stock, history: new_history };
        }

        return { message: "post stock menu failed" }
    }

    // 재고 정보 수정
    async update_stock_menu(stockData: Partial<StockDTO>): Promise<StockDTO> {
        const stock: StockDTO = await this.stockRepository.findOneBy({ idx: stockData.idx });
        Object.assign(stock, stockData)
        const updateStock = await this.stockRepository.save(stock);
        return updateStock
    }

    // 재고 삭제
    async delete_stock_menu(idx: number): Promise<StockDTO> {
        const get_stock: StockEntity = await this.stockRepository.findOneBy({ idx: idx });
        get_stock.isdeleted = 1;
        const delete_stock = await this.stockRepository.save(get_stock);
        return delete_stock;
    }

    // 재고 수량 등록
    async regist_stock_qty(idx: number, data: RegistStockQtyDTO): Promise<{ stock: StockDTO, history: StockHistoryEntity } | { message: string }> {
        const stockMenu = await this.stockRepository.findOneBy({ idx: idx });
        const insertData = {
            stocknumber: idx,
            qty: data.qty >= stockMenu.qty ? data.qty - stockMenu.qty : stockMenu.qty - data.qty,
            is_add: data.qty >= stockMenu.qty ? 1 : 0,
            desc: data.desc,
            writetime: data.writetime,
            writer: "admin"
        };

        stockMenu.qty = data.qty;
        const edited_stock = await this.stockRepository.save(stockMenu);

        if (edited_stock) {
            const new_history = await this.stockHistoryRepository.save(insertData);
            return { stock: edited_stock, history: new_history };
        }

        return { message: "post stock failed" }
    }
}