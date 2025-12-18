import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе (без пароля и связанных сущностей)',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getProfile(@Request() req): Promise<ProfileResponseDto> {
    // req.user содержит данные пользователя из JWT стратегии
    return this.profileService.getProfile(req.user.id);
  }
}

