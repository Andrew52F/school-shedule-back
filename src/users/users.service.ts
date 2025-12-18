import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    // Проверяем, существует ли пользователь с таким логином
    const existingUser = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['teacher'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByLogin(login: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { login },
      // Не загружаем relations для проверки существования
    });
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // Если обновляется пароль, хешируем его
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Если обновляется логин, проверяем уникальность
    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const existingUser = await this.userRepository.findOne({
        where: { login: updateUserDto.login },
      });

      if (existingUser) {
        throw new ConflictException('User with this login already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

