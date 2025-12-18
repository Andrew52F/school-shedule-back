import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Загружаем переменные окружения
const envPath = path.resolve(__dirname, '../.env');
const envDevPath = path.resolve(__dirname, '../.env.dev');

if (fs.existsSync(envPath)) {
  config({ path: envPath });
}
if (fs.existsSync(envDevPath)) {
  config({ path: envDevPath });
}

// Загружаем переменные из process.env
config();

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'school_schedule',
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    console.log('Dropping all tables...');
    
    // Получаем все таблицы
    const tables = await queryRunner.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    // Удаляем все таблицы
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
      console.log(`Dropped table: ${table.tablename}`);
    }

    console.log('\n✅ All tables dropped successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run start:dev');
    console.log('   2. TypeORM will automatically recreate all tables with the latest schema');
    console.log('   3. Seed data (admin user) will be created automatically');
    
    await queryRunner.release();
    await dataSource.destroy();
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();

