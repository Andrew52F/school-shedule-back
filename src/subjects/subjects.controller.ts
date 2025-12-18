import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Subjects')
@ApiBearerAuth('JWT-auth')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание нового предмета (только для админа)',
    description: 'Создает новый предмет с указанными данными. Возвращает данные предмета без лишних связей (без teachers).',
  })
  @ApiBody({ type: CreateSubjectDto, description: 'Данные для создания предмета' })
  @ApiResponse({ 
    status: 201, 
    description: 'Предмет успешно создан. Возвращает данные предмета без связей.',
    type: SubjectResponseDto,
  })
  create(@Body() createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto> {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список всех предметов',
    description: 'Возвращает список всех предметов. Данные возвращаются без лишних связей (без teachers).',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список предметов. Каждый предмет содержит только основные данные без связей.',
    type: [SubjectResponseDto],
  })
  findAll(): Promise<SubjectResponseDto[]> {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить предмет по ID',
    description: 'Возвращает данные предмета по его UUID. Данные возвращаются без лишних связей (без teachers).',
  })
  @ApiParam({ name: 'id', description: 'UUID предмета', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные предмета. Возвращаются только основные поля без связей.',
    type: SubjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  findOne(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные предмета (только для админа)',
    description: 'Обновляет данные предмета. Возвращает обновленные данные без лишних связей (без teachers).',
  })
  @ApiParam({ name: 'id', description: 'UUID предмета', type: String })
  @ApiBody({ type: UpdateSubjectDto, description: 'Данные для обновления предмета' })
  @ApiResponse({ 
    status: 200, 
    description: 'Предмет успешно обновлен. Возвращаются обновленные данные без связей.',
    type: SubjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponseDto> {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить предмет (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID предмета' })
  @ApiResponse({ status: 200, description: 'Предмет успешно удален' })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }

  @Post(':id/teachers/:teacherId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Добавить учителя к предмету (только для админа)',
    description: 'Добавляет учителя к предмету. Возвращает данные предмета без лишних связей (без teachers).',
  })
  @ApiParam({ name: 'id', description: 'UUID предмета', type: String })
  @ApiParam({ name: 'teacherId', description: 'UUID учителя', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Учитель успешно добавлен к предмету. Возвращаются данные предмета без связей.',
    type: SubjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Предмет или учитель не найдены' })
  addTeacher(
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.addTeacher(id, teacherId);
  }

  @Delete(':id/teachers/:teacherId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Удалить учителя из предмета (только для админа)',
    description: 'Удаляет учителя из предмета. Возвращает данные предмета без лишних связей (без teachers).',
  })
  @ApiParam({ name: 'id', description: 'UUID предмета', type: String })
  @ApiParam({ name: 'teacherId', description: 'UUID учителя', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Учитель успешно удален из предмета. Возвращаются данные предмета без связей.',
    type: SubjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Предмет или учитель не найдены' })
  removeTeacher(
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.removeTeacher(id, teacherId);
  }
}

