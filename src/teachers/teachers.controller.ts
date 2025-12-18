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
import { TeachersService } from './teachers.service';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Teachers')
@ApiBearerAuth('JWT-auth')
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание нового учителя (только для админа)',
    description: 'Создает нового учителя с указанными данными. Возвращает данные учителя без лишних связей (без subjects, teacher, student).',
  })
  @ApiBody({ type: CreateTeacherDto, description: 'Данные для создания учителя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Учитель успешно создан. Возвращает данные учителя без лишних связей.',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Пользователь с таким логином уже существует' })
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<TeacherResponseDto> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список всех учителей',
    description: 'Возвращает список всех учителей. Данные возвращаются без лишних связей (без subjects, teacher, student).',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список учителей. Каждый учитель содержит только основные данные без связей.',
    type: [TeacherResponseDto],
  })
  findAll(): Promise<TeacherResponseDto[]> {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить учителя по ID',
    description: 'Возвращает данные учителя по его UUID. Данные возвращаются без лишних связей (без subjects, teacher, student).',
  })
  @ApiParam({ name: 'id', description: 'UUID учителя', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные учителя. Возвращаются только основные поля без связей.',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  findOne(@Param('id') id: string): Promise<TeacherResponseDto> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные учителя (только для админа)',
    description: 'Обновляет данные учителя. Возвращает обновленные данные без лишних связей (без subjects, teacher, student).',
  })
  @ApiParam({ name: 'id', description: 'UUID учителя', type: String })
  @ApiBody({ type: UpdateTeacherDto, description: 'Данные для обновления учителя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Учитель успешно обновлен. Возвращаются обновленные данные без связей.',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponseDto> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить учителя (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID учителя' })
  @ApiResponse({ status: 200, description: 'Учитель успешно удален' })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }

  @Post(':id/subjects/:subjectId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Добавить предмет учителю (только для админа)',
    description: 'Добавляет предмет учителю. Возвращает данные учителя без лишних связей (без subjects, teacher, student).',
  })
  @ApiParam({ name: 'id', description: 'UUID учителя', type: String })
  @ApiParam({ name: 'subjectId', description: 'UUID предмета', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Предмет успешно добавлен учителю. Возвращаются данные учителя без связей.',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель или предмет не найдены' })
  addSubject(
    @Param('id') id: string,
    @Param('subjectId') subjectId: string,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.addSubject(id, subjectId);
  }

  @Delete(':id/subjects/:subjectId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Удалить предмет у учителя (только для админа)',
    description: 'Удаляет предмет у учителя. Возвращает данные учителя без лишних связей (без subjects, teacher, student).',
  })
  @ApiParam({ name: 'id', description: 'UUID учителя', type: String })
  @ApiParam({ name: 'subjectId', description: 'UUID предмета', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Предмет успешно удален у учителя. Возвращаются данные учителя без связей.',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель или предмет не найдены' })
  removeSubject(
    @Param('id') id: string,
    @Param('subjectId') subjectId: string,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.removeSubject(id, subjectId);
  }
}

