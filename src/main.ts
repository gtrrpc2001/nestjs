import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
<<<<<<< HEAD
  app.enableCors({    
    origin:'*',//['https://web-react-jvpb2alnydi25x.sel5.cloudtype.app/'],
    methods:['POST', 'PUT', 'DELETE', 'GET'],
=======
  app.enableCors({        
    origin: true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
>>>>>>> b03fbe72c0c4e7574eeeaed26ae4cfc82373d2d0
    credentials:true
  }); 
  
  // const configService = app.get(ConfigService) 
  // let port = configService.get<string>('LOCALPORT')
  
  await app.listen('40081');
}
bootstrap();
