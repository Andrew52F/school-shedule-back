import { ApiProperty } from '@nestjs/swagger';
import { TeacherResponseDto } from '../../teachers/dto/teacher-response.dto';
import { SubjectResponseDto } from '../../subjects/dto/subject-response.dto';
import { GroupResponseDto } from '../../groups/dto/group-response.dto';
import { ClassroomResponseDto } from '../../classrooms/dto/classroom-response.dto';

export class LessonDetailDto {
  @ApiProperty({ description: 'UUID урока', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ 
    description: 'Дата и время урока в ISO формате', 
    example: '2024-01-15T09:00:00.000Z',
  })
  dateTime: Date;

  @ApiProperty({ description: 'Полные данные кабинета', type: ClassroomResponseDto })
  classroom: ClassroomResponseDto;

  @ApiProperty({ description: 'Данные учителя', type: TeacherResponseDto })
  teacher: TeacherResponseDto;

  @ApiProperty({ description: 'Данные предмета', type: SubjectResponseDto })
  subject: SubjectResponseDto;

  @ApiProperty({ description: 'Данные группы (класса)', type: GroupResponseDto })
  group: GroupResponseDto;
}

