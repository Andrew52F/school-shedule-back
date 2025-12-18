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
import { GroupsService } from './groups.service';
import { GroupResponseDto } from './dto/group-response.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Groups')
@ApiBearerAuth('JWT-auth')
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Создание новой группы (только для админа)',
    description: 'Создает новую группу. Название группы генерируется автоматически из grade и letter (например, "10-А"). Требуется указать teacherId - ID учителя-руководителя класса. Возвращает данные группы без лишних связей (без students).',
  })
  @ApiBody({ type: CreateGroupDto, description: 'Данные для создания группы' })
  @ApiResponse({ 
    status: 201, 
    description: 'Группа успешно создана. Возвращает данные группы без связей.',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Учитель не найден' })
  create(@Body() createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список всех групп',
    description: 'Возвращает список всех групп. Данные возвращаются без лишних связей (без students).',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список групп. Каждая группа содержит только основные данные без связей.',
    type: [GroupResponseDto],
  })
  findAll(): Promise<GroupResponseDto[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить группу по ID',
    description: 'Возвращает данные группы по ее UUID. Данные возвращаются без лишних связей (без students).',
  })
  @ApiParam({ name: 'id', description: 'UUID группы', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные группы. Возвращаются только основные поля без связей.',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  findOne(@Param('id') id: string): Promise<GroupResponseDto> {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Обновить данные группы (только для админа)',
    description: 'Обновляет данные группы. Если обновляется grade или letter, название группы перегенерируется автоматически. Возвращает обновленные данные без лишних связей (без students).',
  })
  @ApiParam({ name: 'id', description: 'UUID группы', type: String })
  @ApiBody({ type: UpdateGroupDto, description: 'Данные для обновления группы' })
  @ApiResponse({ 
    status: 200, 
    description: 'Группа успешно обновлена. Возвращаются обновленные данные без связей.',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Группа или учитель не найдены' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<GroupResponseDto> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить группу (только для админа)' })
  @ApiParam({ name: 'id', description: 'UUID группы', type: String })
  @ApiResponse({ status: 200, description: 'Группа успешно удалена' })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}

