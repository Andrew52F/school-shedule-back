import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'UUID пользователя', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Логин пользователя', example: 'admin' })
  @Column({ type: 'varchar', length: 100, unique: true })
  login: string;

  @ApiProperty({ description: 'Хешированный пароль', writeOnly: true })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Email пользователя', example: 'ivan@example.com', required: false })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: 'Телефон пользователя', example: '+7 (999) 123-45-67', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Роль пользователя', enum: UserRole, example: UserRole.ADMIN })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({ description: 'Связь с учителем (если роль teacher)', required: false, type: () => Teacher })
  @OneToOne(() => Teacher, (teacher) => teacher.user, { nullable: true })
  teacher: Teacher;

  @ApiProperty({ description: 'Связь с учеником (если роль student)', required: false, type: () => Student })
  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

