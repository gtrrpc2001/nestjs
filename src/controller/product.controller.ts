import { Controller, Get, Post, Body, Query, Put, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistStockQtyDTO } from 'src/dto/regist_stock_qty.dto';
import { StockDTO } from 'src/dto/stock.dto';
import { StockHistoryEntity } from 'src/entity/stockhistory.entity';
import { ProductService } from 'src/service/product.service';

@Controller('mslproduct')
@ApiTags('mslproduct')
export class ProductController {
    constructor(private readonly productService: ProductService,
    ) { }

    @Get("/stock")  // 재고 목록 가져오기
    async get_stock(): Promise<StockDTO[]> {
        return await this.productService.get_stock_list();
    }

    @Post("/stock")  // 재고 신규 등록
    async inset_stock(@Body() stock: Partial<StockDTO>): Promise<StockDTO> {
        return await this.productService.insert_stock_menu(stock);
    }

    @Put("/stock") // 재고 정보 수정하기
    async update_stock(@Body() stockData: Partial<StockDTO>): Promise<StockDTO> {
        return await this.productService.update_stock_menu(stockData);
    }

    @Delete("/stock/:idx") // 재고 삭제하기
    async delete_stock(@Param('idx') idx: number): Promise<StockDTO> {
        return await this.productService.delete_stock_menu(idx);
    }

    @Get("/stock/:idx") // 재고 작업 기록 가져오기
    async get_stock_history(@Param('idx') idx: number): Promise<StockHistoryEntity[]> {
        return await this.productService.get_stock_history(idx);
    }

    @Post("/stock/:idx") // 재고 수량 등록하기
    async regist_stock_qty(@Param('idx') idx: number, @Body() data: RegistStockQtyDTO): Promise<StockHistoryEntity | { message: string }> {
        return await this.productService.regist_stock_qty(idx, data)
    }
}