import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ 
    description: 'Дата и время урока в ISO формате', 
    example: '2024-01-15T09:00:00.000Z',
  })
  @IsDateString()
  dateTime: string;

  @ApiProperty({ description: 'UUID учителя', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  teacherId: string;

  @ApiProperty({ description: 'UUID предмета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  subjectId: string;

  @ApiProperty({ description: 'UUID группы (класса)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ description: 'UUID кабинета', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  classroomId: string;
}

