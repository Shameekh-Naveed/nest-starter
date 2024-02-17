import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    const EMAIL_USER = this.configService.get<string>('EMAIL_USER');
    const EMAIL_PASS = this.configService.get<string>('EMAIL_PASS');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async sendEmail(subject: string, message: string, senderID: number) {
    const SUPER_MAIL = this.configService.get<string>('SUPER_MAIL');
    const text = `Sender ID: ${senderID}\n\n${message}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: SUPER_MAIL,
      subject,
      text,
    });
  }

  async paymentVerification(
    userID: Types.ObjectId | Schema.Types.ObjectId,
    date: string,
    amount: number,
    transactionID: string,
  ) {}
}
