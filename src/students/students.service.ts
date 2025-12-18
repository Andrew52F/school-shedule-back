import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly usersService: UsersService,
  ) {}

  async create(createStudentDto: {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    groupId?: string;
  }): Promise<any> {
    // Проверяем, что пользователь с таким логином не существует
    const existingUser = await this.usersService.findByLogin(createStudentDto.login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Создаем пользователя с ролью STUDENT
    const user = await this.usersService.create({
      login: createStudentDto.login,
      password: createStudentDto.password,
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      phone: createStudentDto.phone,
      role: UserRole.STUDENT,
    });

    // Проверяем, что не существует учителя с таким же id (на всякий случай)
    const existingTeacher = await this.teacherRepository.findOne({ where: { id: user.id } });
    if (existingTeacher) {
      // Если учитель существует, удаляем созданного пользователя
      await this.usersService.remove(user.id);
      throw new ConflictException('Teacher with this user ID already exists');
    }

    // Если передан groupId, связываем с группой
    let group = null;
    if (createStudentDto.groupId) {
      group = await this.groupRepository.findOne({
        where: { id: createStudentDto.groupId },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
    }

    // Создаем ученика и связываем с пользователем и группой
    // id ученика совпадает с id пользователя
    const student = this.studentRepository.create({
      id: user.id, // Используем id пользователя как id ученика
      user: user,
      group: group,
    });

    await this.studentRepository.save(student);
    
    // Возвращаем данные без лишних связей
    return this.findOne(user.id);
  }

  async findAll(): Promise<any[]> {
    const students = await this.studentRepository.find({
      relations: ['user', 'group'],
      select: {
        id: true,
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
        group: {
          id: true,
        },
      },
    });

    return students.map(student => ({
      id: student.id,
      firstName: student.user?.firstName,
      lastName: student.user?.lastName,
      email: student.user?.email,
      phone: student.user?.phone,
      login: student.user?.login,
      groupId: student.group?.id || null,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
  }

  async findOne(id: string): Promise<any> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'group'],
      select: {
        id: true,
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
        group: {
          id: true,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      id: student.id,
      firstName: student.user?.firstName,
      lastName: student.user?.lastName,
      email: student.user?.email,
      phone: student.user?.phone,
      login: student.user?.login,
      groupId: student.group?.id || null,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  async update(id: string, updateStudentDto: Partial<Student> & { groupId?: string } | any): Promise<any> {
    const student = await this.findOne(id);

    // Если обновляется группа
    if (updateStudentDto.groupId !== undefined) {
      if (updateStudentDto.groupId) {
        const group = await this.groupRepository.findOne({
          where: { id: updateStudentDto.groupId },
        });
        if (!group) {
          throw new NotFoundException('Group not found');
        }
        student.group = group;
      } else {
        student.group = null;
      }
    }

    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    // При удалении ученика каскадно удалится пользователь (onDelete: 'CASCADE')
    await this.studentRepository.remove(student);
  }
}

