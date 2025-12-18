import { ApiProperty } from '@nestjs/swagger';

export class ClassroomResponseDto {
  @ApiProperty({ description: 'UUID кабинета', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Полный номер кабинета (генерируется автоматически из floor и number)', example: 105 })
  fullNumber: number;

  @ApiProperty({ description: 'Номер кабинета на этаже', example: 5 })
  number: number;

  @ApiProperty({ description: 'Номер этажа', example: 1 })
  floor: number;

  @ApiProperty({ description: 'Вместимость кабинета', example: 30 })
  capacity: number;

  @ApiProperty({ description: 'Описание кабинета', example: 'Кабинет математики с проектором и интерактивной доской', required: false })
  description?: string;

  @ApiProperty({ description: 'Доступность кабинета', example: true })
  isAvailable: boolean;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

