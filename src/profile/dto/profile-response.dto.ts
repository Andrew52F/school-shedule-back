import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class ProfileResponseDto {
  @ApiProperty({ description: 'UUID пользователя', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Логин пользователя', example: 'teacher1' })
  login: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов' })
  lastName: string;

  @ApiProperty({ description: 'Email пользователя', example: 'ivan@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Телефон пользователя', example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({ description: 'Роль пользователя', enum: UserRole, example: UserRole.TEACHER })
  role: UserRole;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

