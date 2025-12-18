import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Group } from '../groups/entities/group.entity';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { DayScheduleDto } from './dto/day-schedule.dto';
import { LessonDetailDto } from './dto/lesson-detail.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async getScheduleByGroup(
    groupId: string,
    page: number = 1,
    limit: number = 10,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ScheduleResponseDto> {
    // Проверяем существование группы
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }

    // Строим запрос
    const queryBuilder = this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('lesson.subject', 'subject')
      .leftJoinAndSelect('lesson.group', 'group')
      .leftJoinAndSelect('group.teacher', 'groupTeacher')
      .leftJoinAndSelect('lesson.classroom', 'classroom')
      .where('lesson.groupId = :groupId', { groupId })
      .orderBy('lesson.dateTime', 'ASC');

    // Применяем фильтры по дате
    if (dateFrom) {
      // Начало дня для dateFrom (00:00:00)
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('lesson.dateTime >= :dateFrom', {
        dateFrom: fromDate,
      });
    }
    if (dateTo) {
      // Конец дня для dateTo (23:59:59.999)
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('lesson.dateTime <= :dateTo', {
        dateTo: toDate,
      });
    }

    // Получаем все уроки (для группировки по дням)
    const allLessons = await queryBuilder.getMany();

    // Группируем по дням
    const daysMap = this.groupLessonsByDays(allLessons);

    // Преобразуем в массив дней и сортируем по дате (в хронологическом порядке)
    const daysArray = Array.from(daysMap.entries())
      .map(([date, lessons]) => ({
        date,
        lessons: lessons.map(lesson => this.mapToLessonDetail(lesson)),
      }))
      .sort((a, b) => {
        // Сортируем по дате в хронологическом порядке (1, 2, 3...)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    // Применяем пагинацию к дням
    const total = daysArray.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedDays = daysArray.slice(skip, skip + limit);

    return {
      days: paginatedDays,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getScheduleByTeacher(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ScheduleResponseDto> {
    // Проверяем существование учителя
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${teacherId} not found`);
    }

    // Строим запрос
    const queryBuilder = this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('lesson.subject', 'subject')
      .leftJoinAndSelect('lesson.group', 'group')
      .leftJoinAndSelect('group.teacher', 'groupTeacher')
      .leftJoinAndSelect('lesson.classroom', 'classroom')
      .where('lesson.teacherId = :teacherId', { teacherId })
      .orderBy('lesson.dateTime', 'ASC');

    // Применяем фильтры по дате
    if (dateFrom) {
      // Начало дня для dateFrom (00:00:00)
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('lesson.dateTime >= :dateFrom', {
        dateFrom: fromDate,
      });
    }
    if (dateTo) {
      // Конец дня для dateTo (23:59:59.999)
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('lesson.dateTime <= :dateTo', {
        dateTo: toDate,
      });
    }

    // Получаем все уроки (для группировки по дням)
    const allLessons = await queryBuilder.getMany();

    // Группируем по дням
    const daysMap = this.groupLessonsByDays(allLessons);

    // Преобразуем в массив дней и сортируем по дате (в хронологическом порядке)
    const daysArray = Array.from(daysMap.entries())
      .map(([date, lessons]) => ({
        date,
        lessons: lessons.map(lesson => this.mapToLessonDetail(lesson)),
      }))
      .sort((a, b) => {
        // Сортируем по дате в хронологическом порядке (1, 2, 3...)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    // Применяем пагинацию к дням
    const total = daysArray.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedDays = daysArray.slice(skip, skip + limit);

    return {
      days: paginatedDays,
      page,
      limit,
      total,
      totalPages,
    };
  }

  private groupLessonsByDays(lessons: Lesson[]): Map<string, Lesson[]> {
    const daysMap = new Map<string, Lesson[]>();

    for (const lesson of lessons) {
      const date = this.formatDate(lesson.dateTime);
      if (!daysMap.has(date)) {
        daysMap.set(date, []);
      }
      daysMap.get(date)!.push(lesson);
    }

    // Сортируем уроки внутри каждого дня по времени (8:00, 9:00, 10:00...)
    daysMap.forEach((lessonsInDay, date) => {
      lessonsInDay.sort((a, b) => {
        // Сортируем по времени начала урока (timestamp)
        return a.dateTime.getTime() - b.dateTime.getTime();
      });
    });

    return daysMap;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getScheduleByGroupForDay(
    groupId: string,
    date: string,
  ): Promise<DayScheduleDto> {
    // Проверяем существование группы
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }

    // Парсим дату и устанавливаем границы дня
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Строим запрос для одного дня
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('lesson.subject', 'subject')
      .leftJoinAndSelect('lesson.group', 'group')
      .leftJoinAndSelect('group.teacher', 'groupTeacher')
      .leftJoinAndSelect('lesson.classroom', 'classroom')
      .where('lesson.groupId = :groupId', { groupId })
      .andWhere('lesson.dateTime >= :dayStart', { dayStart })
      .andWhere('lesson.dateTime <= :dayEnd', { dayEnd })
      .orderBy('lesson.dateTime', 'ASC')
      .getMany();

    // Сортируем уроки по времени
    lessons.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    return {
      date,
      lessons: lessons.map(lesson => this.mapToLessonDetail(lesson)),
    };
  }

  async getScheduleByTeacherForDay(
    teacherId: string,
    date: string,
  ): Promise<DayScheduleDto> {
    // Проверяем существование учителя
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${teacherId} not found`);
    }

    // Парсим дату и устанавливаем границы дня
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Строим запрос для одного дня
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('lesson.subject', 'subject')
      .leftJoinAndSelect('lesson.group', 'group')
      .leftJoinAndSelect('group.teacher', 'groupTeacher')
      .leftJoinAndSelect('lesson.classroom', 'classroom')
      .where('lesson.teacherId = :teacherId', { teacherId })
      .andWhere('lesson.dateTime >= :dayStart', { dayStart })
      .andWhere('lesson.dateTime <= :dayEnd', { dayEnd })
      .orderBy('lesson.dateTime', 'ASC')
      .getMany();

    // Сортируем уроки по времени
    lessons.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    return {
      date,
      lessons: lessons.map(lesson => this.mapToLessonDetail(lesson)),
    };
  }

  private mapToLessonDetail(lesson: Lesson): LessonDetailDto {
    return {
      id: lesson.id,
      dateTime: lesson.dateTime,
      classroom: {
        id: lesson.classroom.id,
        fullNumber: lesson.classroom.fullNumber,
        number: lesson.classroom.number,
        floor: lesson.classroom.floor,
        capacity: lesson.classroom.capacity,
        description: lesson.classroom.description,
        isAvailable: lesson.classroom.isAvailable,
        createdAt: lesson.classroom.createdAt,
        updatedAt: lesson.classroom.updatedAt,
      },
      teacher: {
        id: lesson.teacher.id,
        firstName: lesson.teacher.user?.firstName || '',
        lastName: lesson.teacher.user?.lastName || '',
        email: lesson.teacher.user?.email,
        phone: lesson.teacher.user?.phone,
        login: lesson.teacher.user?.login || '',
        specialization: lesson.teacher.specialization,
        createdAt: lesson.teacher.createdAt,
        updatedAt: lesson.teacher.updatedAt,
      },
      subject: {
        id: lesson.subject.id,
        name: lesson.subject.name,
        description: lesson.subject.description,
        totalAcademicHours: lesson.subject.totalAcademicHours,
        code: lesson.subject.code,
        createdAt: lesson.subject.createdAt,
        updatedAt: lesson.subject.updatedAt,
      },
      group: {
        id: lesson.group.id,
        name: lesson.group.name,
        grade: lesson.group.grade,
        letter: lesson.group.letter,
        academicYear: lesson.group.academicYear,
        description: lesson.group.description,
        teacherId: lesson.group.teacher?.id || '',
        createdAt: lesson.group.createdAt,
        updatedAt: lesson.group.updatedAt,
      },
    };
  }
}

