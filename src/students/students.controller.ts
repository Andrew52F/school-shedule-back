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
import { StudentsService } from './students.service';
import { StudentResponseDto } from './dto/student-response.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание нового ученика (только для админа)',
    description: 'Создает нового ученика с указанными данными. Возвращает данные ученика без лишних связей (без teacher, group), но с groupId если ученик состоит в группе.',
  })
  @ApiBody({ type: CreateStudentDto, description: 'Данные для создания ученика' })
  @ApiResponse({ 
    status: 201, 
    description: 'Ученик успешно создан. Возвращает данные ученика без лишних связей.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь или группа не найдены' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким логином уже существует' })
  create(@Body() createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список всех учеников',
    description: 'Возвращает список всех учеников. Данные возвращаются без лишних связей (без teacher, group), но с groupId если ученик состоит в группе.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список учеников. Каждый ученик содержит только основные данные без связей.',
    type: [StudentResponseDto],
  })
  findAll(): Promise<StudentResponseDto[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить ученика по ID',
    description: 'Возвращает данные ученика по его UUID. Данные возвращаются без лишних связей (без teacher, group), но с groupId если ученик состоит в группе.',
  })
  @ApiParam({ name: 'id', description: 'UUID ученика', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные ученика. Возвращаются только основные поля без связей.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ученик не найден' })
  findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные ученика (только для админа)',
    description: 'Обновляет данные ученика. Возвращает обновленные данные без лишних связей (без teacher, group), но с groupId если ученик состоит в группе.',
  })
  @ApiParam({ name: 'id', description: 'UUID ученика', type: String })
  @ApiBody({ 
    type: UpdateStudentDto, 
    description: 'Данные для обновления ученика (можно указать groupId для изменения группы)',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ученик успешно обновлен. Возвращаются обновленные данные без связей.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ученик или группа не найдены' })
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить ученика (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID ученика' })
  @ApiResponse({ status: 200, description: 'Ученик успешно удален' })
  @ApiResponse({ status: 404, description: 'Ученик не найден' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}

