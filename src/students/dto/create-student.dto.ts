import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Логин пользователя', example: 'student1' })
  login: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123', format: 'password' })
  password: string;

  @ApiProperty({ description: 'Имя ученика', example: 'Петр' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия ученика', example: 'Петров' })
  lastName: string;

  @ApiProperty({ description: 'Email ученика', example: 'petr@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Телефон ученика', example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({
    description: 'UUID группы (класса)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  groupId?: string;
}
