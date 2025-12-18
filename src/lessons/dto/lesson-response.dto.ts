import { ApiProperty } from '@nestjs/swagger';

export class LessonResponseDto {
  @ApiProperty({ description: 'UUID урока', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ 
    description: 'Дата и время урока в ISO формате', 
    example: '2024-01-15T09:00:00.000Z',
  })
  dateTime: Date;

  @ApiProperty({ description: 'UUID учителя', example: '123e4567-e89b-12d3-a456-426614174000' })
  teacherId: string;

  @ApiProperty({ description: 'UUID предмета', example: '123e4567-e89b-12d3-a456-426614174000' })
  subjectId: string;

  @ApiProperty({ description: 'UUID группы (класса)', example: '123e4567-e89b-12d3-a456-426614174000' })
  groupId: string;

  @ApiProperty({ description: 'UUID кабинета', example: '123e4567-e89b-12d3-a456-426614174000' })
  classroomId: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

