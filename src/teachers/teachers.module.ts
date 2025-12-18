import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Subject, User, Student]),
    UsersModule,
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService, TypeOrmModule],
})
export class TeachersModule {}
