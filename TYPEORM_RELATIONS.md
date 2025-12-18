# Связи в TypeORM: Подробное объяснение

## 1. Типы связей в TypeORM

TypeORM поддерживает следующие типы связей:
- **OneToOne** - один к одному
- **OneToMany / ManyToOne** - один ко многим / многие к одному
- **ManyToMany** - многие ко многим

## 2. Many-to-Many связь (наш случай: Teacher ↔ Subject)

### Как это работает в коде:

```typescript
// Teacher Entity
@ManyToMany(() => Subject, (subject) => subject.teachers)
@JoinTable({
  name: 'teacher_subjects',
  joinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'subjectId', referencedColumnName: 'id' },
})
subjects: Subject[];

// Subject Entity
@ManyToMany(() => Teacher, (teacher) => teacher.subjects)
teachers: Teacher[];
```

### Что происходит на уровне БД:

TypeORM **автоматически создает промежуточную таблицу** `teacher_subjects`:

```sql
CREATE TABLE "teacher_subjects" (
  "teacherId" UUID NOT NULL,
  "subjectId" UUID NOT NULL,
  PRIMARY KEY ("teacherId", "subjectId"),
  FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE,
  FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE
);
```

**Важно:** 
- Вам НЕ нужно создавать отдельную Entity для промежуточной таблицы
- TypeORM управляет этой таблицей автоматически
- `@JoinTable` указывается только на одной стороне связи (сторона "владельца")

## 3. Структура промежуточной таблицы

Промежуточная таблица содержит только два столбца:
- `teacherId` - ссылка на учителя
- `subjectId` - ссылка на предмет

Эти два столбца вместе образуют **составной первичный ключ**, что предотвращает дублирование связей.

## 4. Как оперировать связями

### Вариант 1: Через массив в Entity (рекомендуемый способ)

```typescript
// Добавить предмет учителю
const teacher = await teacherRepository.findOne({
  where: { id: teacherId },
  relations: ['subjects'] // Загружаем связанные предметы
});

const subject = await subjectRepository.findOne({
  where: { id: subjectId }
});

// Добавляем предмет в массив
teacher.subjects.push(subject);
await teacherRepository.save(teacher);

// TypeORM автоматически:
// 1. Сохранит изменения в таблице teachers
// 2. Добавит запись в teacher_subjects
```

### Вариант 2: Через репозиторий (более явный способ)

```typescript
// TypeORM предоставляет метод для работы со связями
await teacherRepository
  .createQueryBuilder()
  .relation(Teacher, 'subjects')
  .of(teacherId)
  .add(subjectId);
```

### Вариант 3: Массовое добавление

```typescript
const teacher = await teacherRepository.findOne({
  where: { id: teacherId },
  relations: ['subjects']
});

const subjects = await subjectRepository.findByIds([subjectId1, subjectId2, subjectId3]);
teacher.subjects = subjects; // Заменяем весь массив
await teacherRepository.save(teacher);
```

## 5. Загрузка связанных данных

### Eager Loading (автоматическая загрузка)

```typescript
@ManyToMany(() => Subject, (subject) => subject.teachers, { eager: true })
subjects: Subject[];
// Теперь subjects всегда загружаются автоматически
```

### Lazy Loading (загрузка по требованию)

```typescript
// В сервисе явно указываем relations
const teacher = await teacherRepository.findOne({
  where: { id: teacherId },
  relations: ['subjects'] // Загружаем связанные предметы
});
```

### Query Builder (гибкая загрузка)

```typescript
const teacher = await teacherRepository
  .createQueryBuilder('teacher')
  .leftJoinAndSelect('teacher.subjects', 'subject')
  .where('teacher.id = :id', { id: teacherId })
  .getOne();
```

## 6. Удаление связей

```typescript
// Удалить предмет у учителя
const teacher = await teacherRepository.findOne({
  where: { id: teacherId },
  relations: ['subjects']
});

// Фильтруем массив, убирая нужный предмет
teacher.subjects = teacher.subjects.filter(s => s.id !== subjectId);
await teacherRepository.save(teacher);

// Или через Query Builder
await teacherRepository
  .createQueryBuilder()
  .relation(Teacher, 'subjects')
  .of(teacherId)
  .remove(subjectId);
```

## 7. Проверка существования связи

```typescript
const teacher = await teacherRepository.findOne({
  where: { id: teacherId },
  relations: ['subjects']
});

const hasSubject = teacher.subjects.some(s => s.id === subjectId);
if (!hasSubject) {
  // Добавляем предмет
}
```

## 8. Каскадные операции

```typescript
@ManyToMany(() => Subject, (subject) => subject.teachers, {
  cascade: true // Автоматически сохраняет связанные сущности
})
subjects: Subject[];
```

## 9. Примеры из нашего кода

### Добавление предмета учителю (TeachersService)

```typescript
async addSubject(teacherId: string, subjectId: string): Promise<Teacher> {
  // 1. Загружаем учителя со связанными предметами
  const teacher = await this.teacherRepository.findOne({
    where: { id: teacherId },
    relations: ['subjects'],
  });

  // 2. Загружаем предмет
  const subject = await this.subjectRepository.findOne({ 
    where: { id: subjectId } 
  });

  // 3. Проверяем, что связь еще не существует
  if (!teacher.subjects.find((s) => s.id === subjectId)) {
    teacher.subjects.push(subject);
    await this.teacherRepository.save(teacher);
    // TypeORM автоматически добавит запись в teacher_subjects
  }

  return await this.findOne(teacherId);
}
```

### Удаление предмета у учителя

```typescript
async removeSubject(teacherId: string, subjectId: string): Promise<Teacher> {
  const teacher = await this.teacherRepository.findOne({
    where: { id: teacherId },
    relations: ['subjects'],
  });

  // Фильтруем массив, убирая предмет
  teacher.subjects = teacher.subjects.filter((s) => s.id !== subjectId);
  await this.teacherRepository.save(teacher);
  // TypeORM автоматически удалит запись из teacher_subjects

  return await this.findOne(teacherId);
}
```

## 10. Что происходит при сохранении

Когда вы вызываете `repository.save(teacher)`:

1. TypeORM проверяет изменения в массиве `subjects`
2. Сравнивает текущее состояние с тем, что в БД
3. **Автоматически**:
   - Добавляет новые записи в `teacher_subjects` для новых связей
   - Удаляет записи из `teacher_subjects` для удаленных связей
   - Оставляет без изменений существующие связи

## 11. Важные моменты

1. **@JoinTable** указывается только на одной стороне (сторона "владельца")
2. **relations** нужно указывать при загрузке, иначе связанные данные не загрузятся
3. TypeORM автоматически управляет промежуточной таблицей
4. При удалении сущности каскадно удаляются связи (если настроено)
5. Составной ключ предотвращает дублирование связей

## 12. SQL запросы, которые выполняет TypeORM

### При добавлении связи:
```sql
INSERT INTO "teacher_subjects" ("teacherId", "subjectId") 
VALUES ($1, $2);
```

### При удалении связи:
```sql
DELETE FROM "teacher_subjects" 
WHERE "teacherId" = $1 AND "subjectId" = $2;
```

### При загрузке со связями:
```sql
SELECT teacher.*, subject.* 
FROM teachers teacher
LEFT JOIN teacher_subjects ts ON ts."teacherId" = teacher.id
LEFT JOIN subjects subject ON subject.id = ts."subjectId"
WHERE teacher.id = $1;
```

