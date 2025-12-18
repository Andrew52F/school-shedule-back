import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty({ description: 'UUID учителя', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Имя учителя', example: 'Иван' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия учителя', example: 'Иванов' })
  lastName: string;

  @ApiProperty({ description: 'Email учителя', example: 'ivan@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Телефон учителя', example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({ description: 'Логин учителя', example: 'teacher1' })
  login: string;

  @ApiProperty({ description: 'Специализация учителя', example: 'Математика и физика', required: false })
  specialization?: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

