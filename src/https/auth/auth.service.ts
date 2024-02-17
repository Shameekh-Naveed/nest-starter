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
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private stripeService: StripeService,
    private prismaService: PrismaService,
  ) {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    phoneNumber: string,
    status: string,
  ) {
    const user = await this.prismaService.user.create({
      data: { firstName, lastName, email, password, role, phoneNumber, status },
    });
    return user;
  }

  async validateUser(email: string, passwordH: string) {
    const user = await this.userService.findOneWithEmail(email);
    if (!user) return null;
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
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
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
