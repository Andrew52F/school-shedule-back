import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Group } from '../groups/entities/group.entity';
import { Classroom } from '../classrooms/entities/classroom.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    // Проверяем существование связанных сущностей
    const teacher = await this.teacherRepository.findOne({
      where: { id: createLessonDto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${createLessonDto.teacherId} not found`);
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: createLessonDto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with id ${createLessonDto.subjectId} not found`);
    }

    const group = await this.groupRepository.findOne({
      where: { id: createLessonDto.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with id ${createLessonDto.groupId} not found`);
    }

    const classroom = await this.classroomRepository.findOne({
      where: { id: createLessonDto.classroomId },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${createLessonDto.classroomId} not found`);
    }

    // Проверяем доступность кабинета
    if (!classroom.isAvailable) {
      throw new BadRequestException(`Classroom with id ${createLessonDto.classroomId} is not available`);
    }

    // Проверяем, не занят ли кабинет в это время
    const conflictingLesson = await this.lessonRepository.findOne({
      where: {
        classroomId: createLessonDto.classroomId,
        dateTime: new Date(createLessonDto.dateTime),
      },
    });

    if (conflictingLesson) {
      throw new BadRequestException(
        `Classroom is already booked at ${createLessonDto.dateTime}`,
      );
    }

    // Проверяем, не занят ли учитель в это время
    const teacherConflict = await this.lessonRepository.findOne({
      where: {
        teacherId: createLessonDto.teacherId,
        dateTime: new Date(createLessonDto.dateTime),
      },
    });

    if (teacherConflict) {
      throw new BadRequestException(
        `Teacher is already busy at ${createLessonDto.dateTime}`,
      );
    }

    // Проверяем, не занята ли группа в это время
    const groupConflict = await this.lessonRepository.findOne({
      where: {
        groupId: createLessonDto.groupId,
        dateTime: new Date(createLessonDto.dateTime),
      },
    });

    if (groupConflict) {
      throw new BadRequestException(
        `Group is already has a lesson at ${createLessonDto.dateTime}`,
      );
    }

    const lesson = this.lessonRepository.create({
      dateTime: new Date(createLessonDto.dateTime),
      teacherId: createLessonDto.teacherId,
      subjectId: createLessonDto.subjectId,
      groupId: createLessonDto.groupId,
      classroomId: createLessonDto.classroomId,
    });

    const savedLesson = await this.lessonRepository.save(lesson) as unknown as Lesson;
    
    return this.findOne(savedLesson.id);
  }

  async findAll(): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonRepository.find({
      select: {
        id: true,
        dateTime: true,
        teacherId: true,
        subjectId: true,
        groupId: true,
        classroomId: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        dateTime: 'ASC',
      },
    });

    return lessons.map(lesson => this.mapToResponseDto(lesson));
  }

  async findOne(id: string): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      select: {
        id: true,
        dateTime: true,
        teacherId: true,
        subjectId: true,
        groupId: true,
        classroomId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    return this.mapToResponseDto(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    // Если обновляется teacherId, проверяем существование учителя
    if (updateLessonDto.teacherId !== undefined) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: updateLessonDto.teacherId },
      });
      if (!teacher) {
        throw new NotFoundException(`Teacher with id ${updateLessonDto.teacherId} not found`);
      }
    }

    // Если обновляется subjectId, проверяем существование предмета
    if (updateLessonDto.subjectId !== undefined) {
      const subject = await this.subjectRepository.findOne({
        where: { id: updateLessonDto.subjectId },
      });
      if (!subject) {
        throw new NotFoundException(`Subject with id ${updateLessonDto.subjectId} not found`);
      }
    }

    // Если обновляется groupId, проверяем существование группы
    if (updateLessonDto.groupId !== undefined) {
      const group = await this.groupRepository.findOne({
        where: { id: updateLessonDto.groupId },
      });
      if (!group) {
        throw new NotFoundException(`Group with id ${updateLessonDto.groupId} not found`);
      }
    }

    // Если обновляется classroomId, проверяем существование кабинета
    if (updateLessonDto.classroomId !== undefined) {
      const classroom = await this.classroomRepository.findOne({
        where: { id: updateLessonDto.classroomId },
      });
      if (!classroom) {
        throw new NotFoundException(`Classroom with id ${updateLessonDto.classroomId} not found`);
      }
      if (!classroom.isAvailable) {
        throw new BadRequestException(`Classroom with id ${updateLessonDto.classroomId} is not available`);
      }
    }

    // Проверяем конфликты, если обновляется dateTime, classroomId, teacherId или groupId
    const newDateTime = updateLessonDto.dateTime ? new Date(updateLessonDto.dateTime) : lesson.dateTime;
    const newClassroomId = updateLessonDto.classroomId ?? lesson.classroomId;
    const newTeacherId = updateLessonDto.teacherId ?? lesson.teacherId;
    const newGroupId = updateLessonDto.groupId ?? lesson.groupId;

    if (updateLessonDto.dateTime || updateLessonDto.classroomId) {
      const conflictingLesson = await this.lessonRepository.findOne({
        where: {
          classroomId: newClassroomId,
          dateTime: newDateTime,
        },
      });

      if (conflictingLesson && conflictingLesson.id !== id) {
        throw new BadRequestException(
          `Classroom is already booked at ${newDateTime.toISOString()}`,
        );
      }
    }

    if (updateLessonDto.dateTime || updateLessonDto.teacherId) {
      const teacherConflict = await this.lessonRepository.findOne({
        where: {
          teacherId: newTeacherId,
          dateTime: newDateTime,
        },
      });

      if (teacherConflict && teacherConflict.id !== id) {
        throw new BadRequestException(
          `Teacher is already busy at ${newDateTime.toISOString()}`,
        );
      }
    }

    if (updateLessonDto.dateTime || updateLessonDto.groupId) {
      const groupConflict = await this.lessonRepository.findOne({
        where: {
          groupId: newGroupId,
          dateTime: newDateTime,
        },
      });

      if (groupConflict && groupConflict.id !== id) {
        throw new BadRequestException(
          `Group is already has a lesson at ${newDateTime.toISOString()}`,
        );
      }
    }

    // Обновляем поля
    if (updateLessonDto.dateTime !== undefined) {
      lesson.dateTime = new Date(updateLessonDto.dateTime);
    }
    if (updateLessonDto.teacherId !== undefined) {
      lesson.teacherId = updateLessonDto.teacherId;
    }
    if (updateLessonDto.subjectId !== undefined) {
      lesson.subjectId = updateLessonDto.subjectId;
    }
    if (updateLessonDto.groupId !== undefined) {
      lesson.groupId = updateLessonDto.groupId;
    }
    if (updateLessonDto.classroomId !== undefined) {
      lesson.classroomId = updateLessonDto.classroomId;
    }

    await this.lessonRepository.save(lesson);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    await this.lessonRepository.delete(id);
  }

  private mapToResponseDto(lesson: Lesson): LessonResponseDto {
    return {
      id: lesson.id,
      dateTime: lesson.dateTime,
      teacherId: lesson.teacherId,
      subjectId: lesson.subjectId,
      groupId: lesson.groupId,
      classroomId: lesson.classroomId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}

