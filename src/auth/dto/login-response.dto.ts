import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT токен для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Тип токена',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Логин пользователя',
    example: 'admin',
  })
  login: string;
}

