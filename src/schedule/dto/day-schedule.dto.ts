import { ApiProperty } from '@nestjs/swagger';
import { LessonDetailDto } from './lesson-detail.dto';

export class DayScheduleDto {
  @ApiProperty({ 
    description: 'Дата дня в формате YYYY-MM-DD', 
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({ 
    description: 'Массив уроков на этот день', 
    type: [LessonDetailDto],
  })
  lessons: LessonDetailDto[];
}

