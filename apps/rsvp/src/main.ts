/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('RSVP example')
    .setDescription('The RSVP description')
    .setVersion('1.0')
    .addTag('rsvp')
    .build();
  
  const app = await NestFactory.create(AppModule);
  const documentFactory = () => SwaggerModule.createDocument(app, config);  
  
  SwaggerModule.setup('rsvp', app, documentFactory);
  
  const globalPrefix = 'rsvp';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
