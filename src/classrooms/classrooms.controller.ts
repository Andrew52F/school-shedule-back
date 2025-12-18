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
import { ClassroomsService } from './classrooms.service';
import { ClassroomResponseDto } from './dto/classroom-response.dto';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Classrooms')
@ApiBearerAuth('JWT-auth')
@Controller('classrooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание нового кабинета (только для админа)',
    description: 'Создает новый кабинет. Полный номер кабинета (fullNumber) генерируется автоматически из floor и number (например, floor=1, number=5 -> fullNumber=105).',
  })
  @ApiBody({ type: CreateClassroomDto, description: 'Данные для создания кабинета' })
  @ApiResponse({ 
    status: 201, 
    description: 'Кабинет успешно создан. Возвращает данные кабинета с автоматически сгенерированным fullNumber.',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Кабинет с таким номером уже существует' })
  create(@Body() createClassroomDto: CreateClassroomDto): Promise<ClassroomResponseDto> {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех кабинетов' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список кабинетов',
    type: [ClassroomResponseDto],
  })
  findAll(): Promise<ClassroomResponseDto[]> {
    return this.classroomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить кабинет по ID' })
  @ApiParam({ name: 'id', description: 'UUID кабинета', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные кабинета',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Кабинет не найден' })
  findOne(@Param('id') id: string): Promise<ClassroomResponseDto> {
    return this.classroomsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные кабинета (только для админа)',
    description: 'Обновляет данные кабинета. Если обновляется floor или number, полный номер кабинета (fullNumber) перегенерируется автоматически.',
  })
  @ApiParam({ name: 'id', description: 'UUID кабинета', type: String })
  @ApiBody({ type: UpdateClassroomDto, description: 'Данные для обновления кабинета' })
  @ApiResponse({ 
    status: 200, 
    description: 'Кабинет успешно обновлен',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Кабинет не найден' })
  @ApiResponse({ status: 409, description: 'Кабинет с таким номером уже существует' })
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить кабинет (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID кабинета', type: String })
  @ApiResponse({ status: 200, description: 'Кабинет успешно удален' })
  @ApiResponse({ status: 404, description: 'Кабинет не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.classroomsService.remove(id);
  }
}

