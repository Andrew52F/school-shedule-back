import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Group } from '../../groups/entities/group.entity';
import { Classroom } from '../../classrooms/entities/classroom.entity';

@Entity('lessons')
export class Lesson {
  @ApiProperty({ description: 'UUID урока', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'Дата и время урока в ISO формате', 
    example: '2024-01-15T09:00:00.000Z',
  })
  @Column({ type: 'timestamp', comment: 'Дата и время урока в ISO формате' })
  dateTime: Date;

  @ApiProperty({ description: 'UUID учителя', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ type: 'uuid', name: 'teacherId' })
  teacherId: string;

  @ApiProperty({ description: 'Учитель', type: () => Teacher })
  @ManyToOne(() => Teacher, { nullable: false })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @ApiProperty({ description: 'UUID предмета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ type: 'uuid', name: 'subjectId' })
  subjectId: string;

  @ApiProperty({ description: 'Предмет', type: () => Subject })
  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @ApiProperty({ description: 'UUID группы (класса)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ type: 'uuid', name: 'groupId' })
  groupId: string;

  @ApiProperty({ description: 'Группа (класс)', type: () => Group })
  @ManyToOne(() => Group, { nullable: false })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ApiProperty({ description: 'UUID кабинета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ type: 'uuid', name: 'classroomId' })
  classroomId: string;

  @ApiProperty({ description: 'Кабинет', type: () => Classroom })
  @ManyToOne(() => Classroom, { nullable: false })
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

