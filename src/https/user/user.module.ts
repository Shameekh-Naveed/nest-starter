import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsService } from '../upload-service/uploads.service';
import { PackagesService } from 'src/packages/packages.service';
import { StripeModule } from '../stripe/stripe.module';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [StripeModule, EmailModule],
  controllers: [UserController],
  providers: [UserService, UploadsService, PackagesService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
