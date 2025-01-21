import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db } from 'src/clsfunc/commonfunc';
import { ProductController } from 'src/controller/product.controller';
import { ProductEntity } from 'src/entity/product.entity';
import { StockEntity } from 'src/entity/stock.entity';
import { StockHistoryEntity } from 'src/entity/stockhistory.entity';
import { ProductService } from 'src/service/product.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StockEntity, ProductEntity, StockHistoryEntity], db.deploy)
    ],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule { }