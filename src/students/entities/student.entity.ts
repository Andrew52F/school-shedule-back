import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('students')
export class Student {
  @ApiProperty({ description: 'UUID ученика (совпадает с id пользователя)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Связь с пользователем', type: () => User })
  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: User;

  @ApiProperty({ description: 'Группа (класс) ученика', type: () => Group })
  @ManyToOne(() => Group, (group) => group.students, { nullable: true })
  @JoinColumn()
  group: Group;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}

