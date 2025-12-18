import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School Schedule API')
    .setDescription('API для системы расписания школьных уроков. Документация автоматически генерируется на основе декораторов в коде.')
    .setVersion('1.0')
    .addTag('Auth', 'Эндпоинты для аутентификации')
    .addTag('Profile', 'Эндпоинты для получения информации о текущем пользователе')
    .addTag('Users', 'Управление пользователями (только для админа)')
    .addTag('Teachers', 'Управление учителями')
    .addTag('Students', 'Управление учениками')
    .addTag('Groups', 'Управление группами (классами)')
    .addTag('Subjects', 'Управление предметами')
    .addTag('Classrooms', 'Управление кабинетами')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен, полученный через /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  const outputPath = join(process.cwd(), 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`Swagger JSON файл успешно создан: ${outputPath}`);

  await app.close();
}

generateSwagger().catch((error) => {
  console.error('Ошибка при генерации Swagger:', error);
  process.exit(1);
});

