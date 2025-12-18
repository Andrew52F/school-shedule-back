import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.usersService.findOne(userId);

    // Возвращаем только персональные данные без пароля и связанных сущностей
    return {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
