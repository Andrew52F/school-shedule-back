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
import { LessonsService } from './lessons.service';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Lessons')
@ApiBearerAuth('JWT-auth')
@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание нового урока (только для админа)',
    description: 'Создает новый урок в расписании. Проверяет доступность кабинета, учителя и группы на указанное время.',
  })
  @ApiBody({ type: CreateLessonDto, description: 'Данные для создания урока' })
  @ApiResponse({ 
    status: 201, 
    description: 'Урок успешно создан',
    type: LessonResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Кабинет, учитель или группа уже заняты в это время, или кабинет недоступен' })
  @ApiResponse({ status: 404, description: 'Учитель, предмет, группа или кабинет не найдены' })
  create(@Body() createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех уроков' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список уроков, отсортированный по дате и времени',
    type: [LessonResponseDto],
  })
  findAll(): Promise<LessonResponseDto[]> {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить урок по ID' })
  @ApiParam({ name: 'id', description: 'UUID урока', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные урока',
    type: LessonResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Урок не найден' })
  findOne(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные урока (только для админа)',
    description: 'Обновляет данные урока. Проверяет доступность кабинета, учителя и группы на новое время.',
  })
  @ApiParam({ name: 'id', description: 'UUID урока', type: String })
  @ApiBody({ type: UpdateLessonDto, description: 'Данные для обновления урока' })
  @ApiResponse({ 
    status: 200, 
    description: 'Урок успешно обновлен',
    type: LessonResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Кабинет, учитель или группа уже заняты в это время, или кабинет недоступен' })
  @ApiResponse({ status: 404, description: 'Урок, учитель, предмет, группа или кабинет не найдены' })
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить урок (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID урока', type: String })
  @ApiResponse({ status: 200, description: 'Урок успешно удален' })
  @ApiResponse({ status: 404, description: 'Урок не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.lessonsService.remove(id);
  }
}

