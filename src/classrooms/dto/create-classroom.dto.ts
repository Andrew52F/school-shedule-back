import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({ description: 'Номер кабинета на этаже', example: 5, minimum: 1 })
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({ description: 'Номер этажа', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  floor: number;

  @ApiProperty({ description: 'Вместимость кабинета', example: 30, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ description: 'Описание кабинета', example: 'Кабинет математики с проектором и интерактивной доской', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Доступность кабинета', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

