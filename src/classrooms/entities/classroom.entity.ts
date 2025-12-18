import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('classrooms')
export class Classroom {
  @ApiProperty({ description: 'UUID кабинета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Полный номер кабинета (генерируется автоматически из floor и number)', example: 105 })
  @Column({ type: 'int', unique: true, comment: 'Полный номер кабинета (генерируется из floor и number)' })
  fullNumber: number;

  @ApiProperty({ description: 'Номер кабинета на этаже', example: 5 })
  @Column({ type: 'int', comment: 'Номер кабинета на этаже' })
  number: number;

  @ApiProperty({ description: 'Номер этажа', example: 1 })
  @Column({ type: 'int', comment: 'Номер этажа' })
  floor: number;

  @ApiProperty({ description: 'Вместимость кабинета', example: 30 })
  @Column({ type: 'int' })
  capacity: number;

  @ApiProperty({ description: 'Описание кабинета', example: 'Кабинет математики с проектором и интерактивной доской', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Доступность кабинета', example: true })
  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

