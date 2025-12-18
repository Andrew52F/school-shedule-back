import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'admin',
  })
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'admin',
    format: 'password',
  })
  password: string;
}

