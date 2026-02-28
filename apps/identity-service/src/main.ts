import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IdentityServiceModule } from './identity-service.module';
import { TransformInterceptor, HttpExceptionFilter } from '@app/common';
import { SeederModule } from './seeder/seeder.module';
import { UsersSeeder } from './seeder';

async function bootstrap() {
  if (process.env['RUN_SEEDER'] === 'true') {
    console.log('Running identity seeders...');
    const seederApp = await NestFactory.createApplicationContext(SeederModule);
    const seeder = seederApp.get(UsersSeeder);
    await seeder.seed();
    await seederApp.close();
    console.log('Identity seeding complete.');
  }

  const app = await NestFactory.create(IdentityServiceModule);

  // Global pipes, interceptors, filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SchoolHub Identity Service')
    .setDescription('Authentication, User Management, and RBAC')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env['IDENTITY_SERVICE_PORT'] ?? 3001;
  await app.listen(port);
  console.log(`Identity Service running on port ${port}`);
}
bootstrap();
