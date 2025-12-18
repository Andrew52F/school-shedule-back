import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('groups')
export class Group {
  @ApiProperty({ description: 'UUID группы', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Название группы (генерируется автоматически из grade и letter)', example: '10-А' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'Класс обучения (1-11)', example: 10 })
  @Column({ type: 'int', comment: 'Класс обучения (1-11)' })
  grade: number;

  @ApiProperty({ description: 'Буква класса', example: 'А' })
  @Column({ type: 'varchar', length: 10 })
  letter: string;

  @ApiProperty({ description: 'Учебный год', example: 2024 })
  @Column({ type: 'int', comment: 'Учебный год (например, 2024)' })
  academicYear: number;

  @ApiProperty({ description: 'Описание группы', example: 'Профильный класс', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Учитель-руководитель класса', type: () => Teacher })
  @ManyToOne(() => Teacher, { nullable: false })
  @JoinColumn()
  teacher: Teacher;

  @ApiProperty({ description: 'Ученики в группе', type: [Student], required: false })
  @OneToMany(() => Student, (student) => student.group)
  students: Student[];

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

