// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validación global para los DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Clientes BTG')
    .setDescription('API para gestión de clientes y fondos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger disponible en /api

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api`);
}

bootstrap();
