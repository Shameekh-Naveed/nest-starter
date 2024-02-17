import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ResponseFormatInterceptor } from './interceptors/response-format/response-format.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    // bodyParser: true, minor testing indicates everything to be working just fine without this
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  // const languageSeeder = app.get(LanguageSeeder);
  // await languageSeeder.seed();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  await app.listen(PORT);
}
bootstrap();
