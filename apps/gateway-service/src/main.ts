import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GatewayServiceModule } from './gateway-service.module';
import { TransformInterceptor, HttpExceptionFilter } from '@app/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes, interceptors, filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (Unified)
  const config = new DocumentBuilder()
    .setTitle('SchoolHub API Gateway')
    .setDescription('Unified API Documentation for SchoolHub Services')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/api/identity/docs-json', name: 'Identity Service' },
        { url: '/api/academic/docs-json', name: 'Academic Service' },
      ],
    },
  });

  const port = process.env['GATEWAY_PORT'] ?? 3000;
  await app.listen(port);
  console.log(`Gateway Service running on port ${port}`);
}
bootstrap();
