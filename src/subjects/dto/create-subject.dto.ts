import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ description: 'Название предмета', example: 'Математика' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание предмета', example: 'Изучение алгебры и геометрии', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Общее количество академических часов', example: 120, required: false })
  @IsOptional()
  @IsInt()
  totalAcademicHours?: number;

  @ApiProperty({ description: 'Код предмета', example: 'MATH-101', required: false })
  @IsOptional()
  @IsString()
  code?: string;
}

