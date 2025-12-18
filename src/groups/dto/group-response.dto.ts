import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ description: 'UUID группы', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Название группы (генерируется автоматически из grade и letter)', example: '10-А' })
  name: string;

  @ApiProperty({ description: 'Класс обучения (1-11)', example: 10 })
  grade: number;

  @ApiProperty({ description: 'Буква класса', example: 'А' })
  letter: string;

  @ApiProperty({ description: 'Учебный год', example: 2024 })
  academicYear: number;

  @ApiProperty({ description: 'Описание группы', example: 'Профильный класс', required: false })
  description?: string;

  @ApiProperty({ 
    description: 'UUID учителя-руководителя класса', 
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  teacherId: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

