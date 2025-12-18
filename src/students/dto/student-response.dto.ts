import { ApiProperty } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty({ description: 'UUID ученика', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Имя ученика', example: 'Петр' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия ученика', example: 'Петров' })
  lastName: string;

  @ApiProperty({ description: 'Email ученика', example: 'petr@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Телефон ученика', example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({ description: 'Логин ученика', example: 'student1' })
  login: string;

  @ApiProperty({ 
    description: 'UUID группы (класса), в которой состоит ученик', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  groupId?: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

