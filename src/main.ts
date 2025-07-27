import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Purano Kitab',
    }),
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
