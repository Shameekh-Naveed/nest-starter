import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class CronJobsService {
  constructor(private configService: ConfigService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async disableStdUni() {
    const UNIVERSITY_MAX_DATE = this.configService.get<number>(
      'UNIVERSITY_MAX_DATE',
    );
    console.log('Checking for students and universities to disable');
    // const universities = await this.universityModel.find({
    //   status: Status.PENDING,
    //   createdAt: {
    //     $lt: new Date(Date.now() - UNIVERSITY_MAX_DATE * 24 * 60 * 60 * 1000),
    //   },
    // });
    // Get all the universities IDs
    // const uniIds = universities.map((uni) => uni._id);
    // const students = await this.userModel.find({
    //   'studentDetails.universityID': { $in: uniIds },
    // });
    // for await (const uni of universities) {
    //   uni.status = Status.BLOCKED;
    //   await uni.save();
    // }
    // for await (const std of students) {
    //   std.status = Status.PENDING;
    //   await std.save();
    // }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  expireVirtualProjects() {
    const PROJECT_MAX_DATE = this.configService.get<number>('PROJECT_MAX_DATE');
    const time = new Date(Date.now() - PROJECT_MAX_DATE * 24 * 60 * 60 * 1000);
    // this.virtualProjectService.findAndExpire(time);
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async blockCompanies() {
    const COMPANY_MAX_DATE = this.configService.get<number>('COMPANY_MAX_DATE');
    const time = new Date(Date.now() - COMPANY_MAX_DATE * 24 * 60 * 60 * 1000);
    // const companies = await this.companyModel.updateMany(
    //   { createdAt: { $lt: time }, status: Status.PENDING },
    //   { $set: { status: Status.BLOCKED } },
    // );
    return 'success';
  }
}
