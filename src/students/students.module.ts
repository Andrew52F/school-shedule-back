import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Group } from '../groups/entities/group.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, Teacher]),
    UsersModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, TypeOrmModule],
})
export class StudentsModule {}

