import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createSubjectDto: Partial<Subject> | any): Promise<any> {
    const subject = this.subjectRepository.create(createSubjectDto);
    const savedSubject = await this.subjectRepository.save(subject) as unknown as Subject;
    
    // Возвращаем данные без лишних связей
    return this.findOne(savedSubject.id);
  }

  async findAll(): Promise<any[]> {
    const subjects = await this.subjectRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        totalAcademicHours: true,
        code: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return subjects;
  }

  async findOne(id: string): Promise<any> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        totalAcademicHours: true,
        code: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async addTeacher(subjectId: string, teacherId: string): Promise<any> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
      relations: ['teachers'],
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (!subject.teachers) {
      subject.teachers = [];
    }
    if (!subject.teachers.find((t) => t.id === teacherId)) {
      subject.teachers.push(teacher);
      await this.subjectRepository.save(subject);
    }

    return await this.findOne(subjectId);
  }

  async removeTeacher(subjectId: string, teacherId: string): Promise<any> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
      relations: ['teachers'],
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (subject.teachers) {
      subject.teachers = subject.teachers.filter((t) => t.id !== teacherId);
      await this.subjectRepository.save(subject);
    }

    return await this.findOne(subjectId);
  }

  async update(id: string, updateSubjectDto: Partial<Subject> | any): Promise<any> {
    await this.subjectRepository.update(id, updateSubjectDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subjectRepository.delete(id);
  }
}

