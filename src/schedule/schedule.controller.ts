import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { DayScheduleDto } from './dto/day-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Schedule')
@ApiBearerAuth('JWT-auth')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('group/:groupId')
  @ApiOperation({ 
    summary: 'Получить расписание для группы',
    description: 'Возвращает расписание уроков для указанной группы, сгруппированное по дням. Поддерживает пагинацию и фильтрацию по датам.',
  })
  @ApiParam({ name: 'groupId', description: 'UUID группы (класса)', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы (по умолчанию 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество дней на странице (по умолчанию 10)', example: 10 })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Начальная дата фильтрации (формат: YYYY-MM-DD). Включает уроки с этой даты и позже.', example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Конечная дата фильтрации (формат: YYYY-MM-DD). Включает уроки до конца этого дня включительно.', example: '2024-01-31' })
  @ApiResponse({ 
    status: 200, 
    description: 'Расписание группы, сгруппированное по дням',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  getScheduleByGroup(
    @Param('groupId') groupId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.getScheduleByGroup(groupId, page, limit, dateFrom, dateTo);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ 
    summary: 'Получить расписание для учителя',
    description: 'Возвращает расписание уроков для указанного учителя, сгруппированное по дням. Поддерживает пагинацию и фильтрацию по датам.',
  })
  @ApiParam({ name: 'teacherId', description: 'UUID учителя', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы (по умолчанию 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество дней на странице (по умолчанию 10)', example: 10 })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Начальная дата фильтрации (формат: YYYY-MM-DD). Включает уроки с этой даты и позже.', example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Конечная дата фильтрации (формат: YYYY-MM-DD). Включает уроки до конца этого дня включительно.', example: '2024-01-31' })
  @ApiResponse({ 
    status: 200, 
    description: 'Расписание учителя, сгруппированное по дням',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  getScheduleByTeacher(
    @Param('teacherId') teacherId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.getScheduleByTeacher(teacherId, page, limit, dateFrom, dateTo);
  }

  @Get('group/:groupId/day/:date')
  @ApiOperation({ 
    summary: 'Получить расписание группы на один день',
    description: 'Возвращает расписание уроков для указанной группы на указанную дату. Уроки отсортированы по времени.',
  })
  @ApiParam({ name: 'groupId', description: 'UUID группы (класса)', type: String })
  @ApiParam({ name: 'date', description: 'Дата в формате YYYY-MM-DD', type: String, example: '2024-01-15' })
  @ApiResponse({ 
    status: 200, 
    description: 'Расписание группы на указанный день',
    type: DayScheduleDto,
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  getScheduleByGroupForDay(
    @Param('groupId') groupId: string,
    @Param('date') date: string,
  ): Promise<DayScheduleDto> {
    return this.scheduleService.getScheduleByGroupForDay(groupId, date);
  }

  @Get('teacher/:teacherId/day/:date')
  @ApiOperation({ 
    summary: 'Получить расписание учителя на один день',
    description: 'Возвращает расписание уроков для указанного учителя на указанную дату. Уроки отсортированы по времени.',
  })
  @ApiParam({ name: 'teacherId', description: 'UUID учителя', type: String })
  @ApiParam({ name: 'date', description: 'Дата в формате YYYY-MM-DD', type: String, example: '2024-01-15' })
  @ApiResponse({ 
    status: 200, 
    description: 'Расписание учителя на указанный день',
    type: DayScheduleDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  getScheduleByTeacherForDay(
    @Param('teacherId') teacherId: string,
    @Param('date') date: string,
  ): Promise<DayScheduleDto> {
    return this.scheduleService.getScheduleByTeacherForDay(teacherId, date);
  }
}

