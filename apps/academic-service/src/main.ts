import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AcademicServiceModule } from './academic-service.module';
import { TransformInterceptor, HttpExceptionFilter } from '@app/common';
import { SeederModule } from './seeder/seeder.module';
import { AcademicSeeder } from './seeder';

async function bootstrap() {
  if (process.env['RUN_SEEDER'] === 'true') {
    console.log('Running academic seeders...');
    const seederApp = await NestFactory.createApplicationContext(SeederModule);
    const seeder = seederApp.get(AcademicSeeder);
    await seeder.seed();
    await seederApp.close();
    console.log('Academic seeding complete.');
  }

  const app = await NestFactory.create(AcademicServiceModule);

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
    .setTitle('SchoolHub Academic Service')
    .setDescription('Academic years, departments, classes, enrollments, subjects, teaching assignments')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env['ACADEMIC_SERVICE_PORT'] ?? 3002;
  await app.listen(port);
  console.log(`Academic Service running on port ${port}`);
}
bootstrap();
