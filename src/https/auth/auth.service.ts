import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums/user-role.enum';
import { JwtPayload } from 'src/interfaces/jwt-payload';
import { Status } from 'src/enums/status.enum';
import { CompanyPackage, UniversityPackage } from 'src/packages/package.class';
import { StripeService } from '../stripe/stripe.service';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private stripeService: StripeService,
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, passwordH: string) {
    const user = await this.userService.findOneWithEmail(email);
    const valid = await bcrypt.compare(passwordH, user.password);
    if (!valid) return null;

    const completeInfo = await this.getCompleteUserInfo(user);
    return completeInfo;
  }

  async getCompleteUserInfo(user: User) {
    // TODO: Figure out a way for this to not be type any
    // const organizationID =
    //   user.companyModDetails?.companyID || user.uniModDetails?.uniID || '';
    // let userPackage;
    // if (organizationID)
    //   userPackage = await this.stripeService.getSubscription(organizationID);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      status: user.status,
      // package: userPackage?.productID || undefined,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        // uniID: user.uniID,
        // companyID: user.companyID,
        // package: user.package,
      },
      roles: [user.role, user.status],
    };
    // if (user.role === UserRole.STUDENT)
    // payload.roles = ['student', user.status];

    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async hashPassword(password: string) {
    const saltRounds = 5;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  async resetPassword(id: number, password: string) {
    const hashedPassword = await this.hashPassword(password);
    await this.userService.resetPassword(id, hashedPassword);
    const updated = await this.updateToken(id);
    return updated;
  }

  async updateToken(userID: number) {
    const user = await this.userService.findOne(userID);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const completeInfo = await this.getCompleteUserInfo(user);

    const payload: JwtPayload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        // package: completeInfo.package,
      },
      roles: [user.role, user.status],
    };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async forgetPassword(email: string) {
    const user = await this.userService.findOneWithEmail(email);
    const resetToken = {
      id: user.id,
      email: user.email,
    };
    const signed = this.jwtService.sign(resetToken, { expiresIn: '5m' });
    const CLIENT_ADDRESS = this.configService.get<string>('CLIENT_ADDRESS');
    const resetLink = `${CLIENT_ADDRESS}/reset-password?token=${signed}`;
    await this.emailService.resetPassword(user.email, resetLink);
  }

  async refreshToken(user: User) {
    const payload = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        status: user.status,
      },
      role: [user.role, user.status],
    };
    if (user.role === UserRole.STUDENT)
      payload.role = [UserRole.STUDENT, user.status];

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
