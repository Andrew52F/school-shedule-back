import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  // Проверяем, существует ли уже админ
  const existingAdmin = await userRepository.findOne({
    where: { login: 'admin' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Создаем админа
  const hashedPassword = await bcrypt.hash('admin', 10);

  const admin = userRepository.create({
    login: 'admin',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);
  console.log('Admin user created successfully (login: admin, password: admin)');
}

