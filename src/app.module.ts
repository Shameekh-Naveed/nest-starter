import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { AuthModule } from './https/auth/auth.module';
import { UserModule } from './https/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from './https/upload-service/uploads.service';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './https/stripe/stripe.module';
import { PackagesModule } from './packages/packages.module';
import { PrismaService } from './https/prisma/prisma.service';
import { ProductModule } from './https/product/product.module';
import { OrderModule } from './https/order/order.module';
import { CartModule } from './https/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),

    // MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads2',
    }),
    CronJobsModule,
    AuthModule,
    UserModule,
    StripeModule,
    PackagesModule,
    ProductModule,
    OrderModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadsService, PrismaService],
})
export class AppModule {}
