import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'Класс обучения (1-11)', example: 10, minimum: 1, maximum: 11 })
  @IsInt()
  @Min(1)
  @Max(11)
  grade: number;

  @ApiProperty({ description: 'Буква класса', example: 'А' })
  @IsString()
  letter: string;

  @ApiProperty({ description: 'Учебный год', example: 2024 })
  @IsInt()
  academicYear: number;

  @ApiProperty({ 
    description: 'UUID учителя-руководителя класса', 
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  teacherId: string;

  @ApiProperty({ description: 'Описание группы', example: 'Профильный класс', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

