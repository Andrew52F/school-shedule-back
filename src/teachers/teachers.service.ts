import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly usersService: UsersService,
  ) {}

  async create(createTeacherDto: {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    specialization?: string;
  }): Promise<any> {
    // Проверяем, что пользователь с таким логином не существует
    const existingUser = await this.usersService.findByLogin(createTeacherDto.login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Создаем пользователя с ролью TEACHER
    const user = await this.usersService.create({
      login: createTeacherDto.login,
      password: createTeacherDto.password,
      firstName: createTeacherDto.firstName,
      lastName: createTeacherDto.lastName,
      email: createTeacherDto.email,
      phone: createTeacherDto.phone,
      role: UserRole.TEACHER,
    });

    // Проверяем, что не существует студента с таким же id (на всякий случай)
    const existingStudent = await this.studentRepository.findOne({ where: { id: user.id } });
    if (existingStudent) {
      // Если студент существует, удаляем созданного пользователя
      await this.usersService.remove(user.id);
      throw new ConflictException('Student with this user ID already exists');
    }

    // Создаем учителя и связываем с пользователем
    // id учителя совпадает с id пользователя
    const teacher = this.teacherRepository.create({
      id: user.id, // Используем id пользователя как id учителя
      specialization: createTeacherDto.specialization,
      user: user,
    });

    await this.teacherRepository.save(teacher);
    
    // Возвращаем данные без лишних связей
    return this.findOne(user.id);
  }

  async findAll(): Promise<any[]> {
    const teachers = await this.teacherRepository.find({
      relations: ['user'],
      select: {
        id: true,
        specialization: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          login: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    });

    return teachers.map(teacher => ({
      id: teacher.id,
      firstName: teacher.user?.firstName,
      lastName: teacher.user?.lastName,
      email: teacher.user?.email,
      phone: teacher.user?.phone,
      login: teacher.user?.login,
      specialization: teacher.specialization,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    }));
  }

  async findOne(id: string): Promise<any> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        specialization: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          login: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return {
      id: teacher.id,
      firstName: teacher.user?.firstName,
      lastName: teacher.user?.lastName,
      email: teacher.user?.email,
      phone: teacher.user?.phone,
      login: teacher.user?.login,
      specialization: teacher.specialization,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  async addSubject(teacherId: string, subjectId: string): Promise<any> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['subjects'],
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (!teacher.subjects) {
      teacher.subjects = [];
    }
    if (!teacher.subjects.find((s) => s.id === subjectId)) {
      teacher.subjects.push(subject);
      await this.teacherRepository.save(teacher);
    }

    return await this.findOne(teacherId);
  }

  async removeSubject(teacherId: string, subjectId: string): Promise<any> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['subjects'],
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.subjects) {
      teacher.subjects = teacher.subjects.filter((s) => s.id !== subjectId);
      await this.teacherRepository.save(teacher);
    }

    return await this.findOne(teacherId);
  }

  async update(id: string, updateTeacherDto: Partial<Teacher> | any): Promise<any> {
    await this.teacherRepository.update(id, updateTeacherDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    // При удалении учителя каскадно удалится пользователь (onDelete: 'CASCADE')
    await this.teacherRepository.remove(teacher);
  }
}

