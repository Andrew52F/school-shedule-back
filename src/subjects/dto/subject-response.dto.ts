import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty({ description: 'UUID предмета', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Название предмета', example: 'Математика' })
  name: string;

  @ApiProperty({ description: 'Описание предмета', example: 'Изучение алгебры и геометрии', required: false })
  description?: string;

  @ApiProperty({ description: 'Общее количество академических часов', example: 120, required: false })
  totalAcademicHours?: number;

  @ApiProperty({ 
    description: 'Код предмета (уникальный идентификатор для систематизации и отчетности, например, для учебных планов)', 
    example: 'MATH-101', 
    required: false,
  })
  code?: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

