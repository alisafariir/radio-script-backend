import { CreateUserByEmailDto, CreateUserByPhoneNumberDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { EncryptionService } from '@/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { I18nService } from 'nestjs-i18n';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private encryptionService: EncryptionService,
    private readonly i18n: I18nService
  ) {}

  async createUserByEmail(createUserDto: CreateUserByEmailDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      return existingUser;
    }

    if (!existingUser) {
      const user = this.userRepository.create({
        ...createUserDto,
      });
      return await this.userRepository.save(user);
    }
  }

  async createUserByPhoneNumber(createUserDto: CreateUserByPhoneNumberDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { phone_number: createUserDto.phone_number },
    });

    if (existingUser) {
      return existingUser;
    }

    // User does not exist
    if (!existingUser) {
      const user = this.userRepository.create({
        ...createUserDto,
      });
      return await this.userRepository.save(user);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(this.i18n.t('error.USER_NOT_FOUND'));
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await await this.encryptionService.hash(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByPhoneNumber(phone_number: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone_number } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
