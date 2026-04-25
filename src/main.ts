import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { AppConfig } from './shared/config';
import { HttpExceptionFilter } from './shared/filters';
async function bootstrap() {
  const logger = new ConsoleLogger('Bootstrap');

  await AppConfig.validateConfig();
  logger.log('Environment configuration validated');
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Purano Kitab',
    }),
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Purano Kitab API')
    .setDescription('API documentation for Purano Kitab')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ 'access-token': [] }];
  SwaggerModule.setup('api/docs', app, document);

  //   setInterval(() => {
  //   const used = process.memoryUsage();
  //   console.log('Memory Usage:');
  //   console.log(`RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
  // }, 10000);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
