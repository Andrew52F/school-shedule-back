import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createGroupDto: {
    grade: number;
    letter: string;
    academicYear: number;
    teacherId: string;
    description?: string;
  }): Promise<any> {
    // Проверяем, что учитель существует
    const teacher = await this.teacherRepository.findOne({
      where: { id: createGroupDto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Генерируем название группы из grade и letter (например, "10-А")
    const name = `${createGroupDto.grade}-${createGroupDto.letter}`;

    // Создаем группу
    const group = this.groupRepository.create({
      name,
      grade: createGroupDto.grade,
      letter: createGroupDto.letter,
      academicYear: createGroupDto.academicYear,
      description: createGroupDto.description,
      teacher: teacher,
    });

    await this.groupRepository.save(group);
    
    // Возвращаем данные без лишних связей
    return this.findOne(group.id);
  }

  async findAll(): Promise<any[]> {
    const groups = await this.groupRepository.find({
      relations: ['teacher'],
      select: {
        id: true,
        name: true,
        grade: true,
        letter: true,
        academicYear: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        teacher: {
          id: true,
        },
      },
    });

    return groups.map(group => ({
      id: group.id,
      name: group.name,
      grade: group.grade,
      letter: group.letter,
      academicYear: group.academicYear,
      description: group.description,
      teacherId: group.teacher?.id,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    }));
  }

  async findOne(id: string): Promise<any> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['teacher'],
      select: {
        id: true,
        name: true,
        grade: true,
        letter: true,
        academicYear: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        teacher: {
          id: true,
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return {
      id: group.id,
      name: group.name,
      grade: group.grade,
      letter: group.letter,
      academicYear: group.academicYear,
      description: group.description,
      teacherId: group.teacher?.id,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  async update(id: string, updateGroupDto: {
    grade?: number;
    letter?: string;
    academicYear?: number;
    teacherId?: string;
    description?: string;
  }): Promise<any> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Если обновляется teacherId, проверяем существование учителя
    if (updateGroupDto.teacherId) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: updateGroupDto.teacherId },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      group.teacher = teacher;
    }

    // Если обновляется grade или letter, перегенерируем name
    if (updateGroupDto.grade !== undefined || updateGroupDto.letter !== undefined) {
      const newGrade = updateGroupDto.grade !== undefined ? updateGroupDto.grade : group.grade;
      const newLetter = updateGroupDto.letter !== undefined ? updateGroupDto.letter : group.letter;
      group.name = `${newGrade}-${newLetter}`;
    }

    // Обновляем остальные поля
    if (updateGroupDto.grade !== undefined) {
      group.grade = updateGroupDto.grade;
    }
    if (updateGroupDto.letter !== undefined) {
      group.letter = updateGroupDto.letter;
    }
    if (updateGroupDto.academicYear !== undefined) {
      group.academicYear = updateGroupDto.academicYear;
    }
    if (updateGroupDto.description !== undefined) {
      group.description = updateGroupDto.description;
    }

    await this.groupRepository.save(group);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }
}

