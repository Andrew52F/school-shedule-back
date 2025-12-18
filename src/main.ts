import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { seedAdmin } from './database/seed-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger для автоматической генерации документации
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
    .addTag('Lessons', 'Управление расписанием уроков')
    .addTag('Schedule', 'Просмотр расписания (группировка по дням)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен, полученный через /auth/login',
        in: 'header',
      },
      'JWT-auth', // Это имя должно совпадать с тем, что используется в @ApiBearerAuth()
    )
    .build();

  // Создание Swagger документа с автоматической генерацией на основе декораторов
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true, // Глубокое сканирование маршрутов для автоматического обнаружения
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey, // Автоматическая генерация operationId
  });

  // Настройка Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Сохраняет токен авторизации между перезагрузками
      displayRequestDuration: true, // Показывать время выполнения запроса
      filter: true, // Включить фильтрацию по тегам
      showExtensions: true, // Показывать расширения
      showCommonExtensions: true, // Показывать общие расширения
    },
    customSiteTitle: 'School Schedule API Documentation',
    customCss: '.swagger-ui .topbar { display: none }', // Скрыть топбар Swagger
  });

  // Создаем начального админа
  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    await seedAdmin(dataSource);
  } catch (error) {
    console.error('Error seeding admin:', error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();

