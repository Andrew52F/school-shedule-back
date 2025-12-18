import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'Логин пользователя', example: 'teacher1' })
  login: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123', format: 'password' })
  password: string;

  @ApiProperty({ description: 'Имя учителя', example: 'Иван' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия учителя', example: 'Иванов' })
  lastName: string;

  @ApiProperty({ description: 'Email учителя', example: 'ivan@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Телефон учителя', example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({ description: 'Специализация учителя', example: 'Математика и физика', required: false })
  specialization?: string;
}

