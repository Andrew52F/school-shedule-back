import { ApiProperty } from '@nestjs/swagger';
import { DayScheduleDto } from './day-schedule.dto';

export class ScheduleResponseDto {
  @ApiProperty({ 
    description: 'Массив дней с расписанием', 
    type: [DayScheduleDto],
  })
  days: DayScheduleDto[];

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  page: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Общее количество дней', example: 25 })
  total: number;

  @ApiProperty({ description: 'Общее количество страниц', example: 3 })
  totalPages: number;
}

