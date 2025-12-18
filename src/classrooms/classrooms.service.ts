import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: {
    number: number;
    floor: number;
    capacity: number;
    description?: string;
    isAvailable?: boolean;
  }): Promise<any> {
    // Генерируем полный номер кабинета из floor и number (например, floor=1, number=5 -> fullNumber=105)
    const fullNumber = createClassroomDto.floor * 100 + createClassroomDto.number;

    // Проверяем, не существует ли уже кабинет с таким полным номером
    const existingClassroom = await this.classroomRepository.findOne({
      where: { fullNumber },
    });

    if (existingClassroom) {
      throw new ConflictException(`Classroom with fullNumber ${fullNumber} already exists`);
    }

    const classroom = this.classroomRepository.create({
      fullNumber,
      number: createClassroomDto.number,
      floor: createClassroomDto.floor,
      capacity: createClassroomDto.capacity,
      description: createClassroomDto.description,
      isAvailable: createClassroomDto.isAvailable !== undefined ? createClassroomDto.isAvailable : true,
    });

    const savedClassroom = await this.classroomRepository.save(classroom) as unknown as Classroom;
    
    // Возвращаем данные
    return this.findOne(savedClassroom.id);
  }

  async findAll(): Promise<any[]> {
    return await this.classroomRepository.find({
      select: {
        id: true,
        fullNumber: true,
        number: true,
        floor: true,
        capacity: true,
        description: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<any> {
    const classroom = await this.classroomRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullNumber: true,
        number: true,
        floor: true,
        capacity: true,
        description: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async update(
    id: string,
    updateClassroomDto: {
      number?: number;
      floor?: number;
      capacity?: number;
      description?: string;
      isAvailable?: boolean;
    },
  ): Promise<any> {
    const classroom = await this.classroomRepository.findOne({ where: { id } });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Если обновляется floor или number, перегенерируем fullNumber
    if (updateClassroomDto.floor !== undefined || updateClassroomDto.number !== undefined) {
      const newFloor = updateClassroomDto.floor !== undefined ? updateClassroomDto.floor : classroom.floor;
      const newNumber = updateClassroomDto.number !== undefined ? updateClassroomDto.number : classroom.number;
      classroom.fullNumber = newFloor * 100 + newNumber;
      
      // Проверяем, не существует ли уже кабинет с таким полным номером
      const existingClassroom = await this.classroomRepository.findOne({
        where: { fullNumber: classroom.fullNumber },
      });

      if (existingClassroom && existingClassroom.id !== id) {
        throw new ConflictException(`Classroom with fullNumber ${classroom.fullNumber} already exists`);
      }
    }

    // Обновляем остальные поля
    if (updateClassroomDto.floor !== undefined) {
      classroom.floor = updateClassroomDto.floor;
    }
    if (updateClassroomDto.number !== undefined) {
      classroom.number = updateClassroomDto.number;
    }
    if (updateClassroomDto.capacity !== undefined) {
      classroom.capacity = updateClassroomDto.capacity;
    }
    if (updateClassroomDto.description !== undefined) {
      classroom.description = updateClassroomDto.description;
    }
    if (updateClassroomDto.isAvailable !== undefined) {
      classroom.isAvailable = updateClassroomDto.isAvailable;
    }

    await this.classroomRepository.save(classroom);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.classroomRepository.delete(id);
  }
}

