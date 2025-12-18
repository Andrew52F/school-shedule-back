import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subject } from '../../subjects/entities/subject.entity';
import { User } from '../../users/entities/user.entity';

@Entity('teachers')
export class Teacher {
  @ApiProperty({ description: 'UUID учителя (совпадает с id пользователя)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Связь с пользователем', type: () => User })
  @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: User;

  @ApiProperty({ description: 'Специализация учителя', example: 'Математика и физика', required: false })
  @Column({ type: 'text', nullable: true })
  specialization: string;

  @ApiProperty({ description: 'Предметы учителя', type: [Subject], required: false })
  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable({
    name: 'teacher_subjects',
    joinColumn: { name: 'teacherId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subjectId', referencedColumnName: 'id' },
  })
  subjects: Subject[];

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

