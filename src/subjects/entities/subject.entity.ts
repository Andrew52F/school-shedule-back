import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('subjects')
export class Subject {
  @ApiProperty({ description: 'UUID предмета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Название предмета', example: 'Математика' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty({ description: 'Описание предмета', example: 'Изучение алгебры и геометрии', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Общее количество академических часов', example: 120, required: false })
  @Column({ type: 'int', nullable: true })
  totalAcademicHours: number;

  @ApiProperty({ 
    description: 'Код предмета (уникальный идентификатор для систематизации и отчетности, например, для учебных планов и документооборота)', 
    example: 'MATH-101', 
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Уникальный код предмета для систематизации и отчетности' })
  code: string;

  @ApiProperty({ description: 'Учителя, преподающие предмет', type: [Teacher], required: false })
  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

