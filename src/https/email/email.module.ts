import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';

@Module({
  imports: [
  ],
  // controllers: [StripeController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
