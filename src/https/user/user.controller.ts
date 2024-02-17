import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateUniModDto } from './dto/create-uniMod.dto';

import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { Status } from 'src/enums/status.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../upload-service/uploads.service';
import { ExtendedRequest } from 'src/interfaces/extended-request';
import { ConfigService } from '@nestjs/config';
import { MaxStudentsInterceptor } from 'src/interceptors/max-students/max-students.interceptor';
import { CreateSupport } from './dto/create-support.dto';

@Controller('user')
@UseGuards(JwtGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadsService,
    private configService: ConfigService,
  ) {
    const PORT = this.configService.get<number>('PORT');
    console.log({ PORT });
  }

  @SetMetadata('roles', [
    [UserRole.STUDENT, Status.APPROVED],
    [UserRole.UNIMOD, Status.APPROVED],
    [UserRole.ADMIN, Status.APPROVED],
    [UserRole.OWNER, Status.APPROVED],
  ])
  @Get('student/:id')
  findOneStd(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @SetMetadata('roles', [[]])
  @Delete(':id')
  remove(@Req() req: ExtendedRequest) {
    const userID = req.user.user.id;
    // return this.userService.remove(userID);
  }
}
