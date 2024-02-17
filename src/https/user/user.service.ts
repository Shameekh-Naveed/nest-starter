import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUniModDto } from './dto/create-uniMod.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { Status } from 'src/enums/status.enum';
import { UniModRole } from 'src/enums/uni-mod-role.enum';
import { Entity } from 'src/enums/entity.enum';
import { CreateSupport } from './dto/create-support.dto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    // @InjectModel('User') private userModel: Model<User>,
    private prisma: PrismaService,
    private readonly mailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      profilePicture,
      uniID,
    } = createUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user)
      throw new BadRequestException('User with this email already exists');

    const userDetails: any = {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      profilePicture,
    };

    if (role === UserRole.UNIMOD) userDetails.uniModDetails = { uniID };
    else if (role === UserRole.STUDENT)
      userDetails.studentDetails = {
        dateOfBirth: new Date(createUserDto.dateOfBirth),
        gender: createUserDto.gender,
        location: createUserDto.location,
        website: createUserDto.website,
        languages: createUserDto.languages,
        universityID: createUserDto.universityID,
      };
    else if (role === UserRole.COMPANYMOD)
      userDetails.companyModDetails = {
        companyID: createUserDto.companyID,
      };

    const saveUser = await this.prisma.user.create({
      data: userDetails,
    });
    return saveUser.id;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneWithEmail(email: string) {
    // const user = await this.userModel.findOne({ email });
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // TODO: Add a filter here
  async search(page: number, limit: number, name: string) {
    const MaxLimit = limit;
    const skip = (page - 1) * MaxLimit;
    const words = name.split(/\s+/);
    // Create a regular expression pattern for case-insensitive matching
    const regexPattern = words.map((word) => new RegExp(word, 'i'));

    // return await this.userModel
    //   .find({
    //     $and: [
    //       {
    //         $or: [{ firstName: regexPattern }, { lastName: regexPattern }],
    //       },
    //       { role: 'student' }, // Add the condition for the role field
    //     ],
    //   })
    //   .select('firstName lastName email profilePicture')
    //   .skip(skip)
    //   .limit(MaxLimit);
  }

}
