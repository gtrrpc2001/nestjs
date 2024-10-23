import { Module } from '@nestjs/common';
import { allModule } from '../exportMVC/exportall';



@Module({
  imports: allModule.appImport,
  controllers: [],
  providers: [],
})
export class AppModule { }
