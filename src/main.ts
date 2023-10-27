import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );
  
  const config = new DocumentBuilder()
  .setTitle('msl')
  .setDescription('API description')
  .setVersion('1.0')
  .build()

  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);
  app.enableCors({    
    origin: ['https://web-react-jvpb2alnydi25x.sel5.cloudtype.app/'],//'*',
    methods:['POST', 'PUT', 'DELETE', 'GET'],
    credentials:true
  }); 
  
  // const configService = app.get(ConfigService) 
  // let port = configService.get<string>('LOCALPORT')
  
  await app.listen('40081');
}
bootstrap();
