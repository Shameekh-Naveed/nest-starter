import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { LocalStrategy } from './strategies/local-strategy';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsService } from '../upload-service/uploads.service';
import { ConfigService } from '@nestjs/config';
import { StripeModule } from '../stripe/stripe.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    // GroupModule,
    // ApplicationModule,
    // CommentModule,
    UserModule,
    StripeModule,
  ],
  providers: [
    AuthService,
    // LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    // UserService,
    UploadsService,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
