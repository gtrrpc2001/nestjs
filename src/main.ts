import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

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
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: [process.env.COR_ORIGIN_DOMAIN1, process.env.COR_ORIGIN_DOMAIN2, process.env.COR_ORIGIN_DOMAIN3, process.env.COR_ORIGIN_DOMAIN4],
    // '*',    
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true
  });

  await app.listen('40081');
}
bootstrap();
