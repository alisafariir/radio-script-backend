import { Roles } from '@/decorators';
import { CreateUserByPhoneNumberDto, UpdateUserDto, UserQueryDto } from '@/dtos';
import { User } from '@/entities';
import { UserRole } from '@/enums';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { UserResponseDto } from '@/interfaces';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserByPhoneNumberDto): Promise<UserResponseDto> {
    const user = await this.userService.createUserByPhoneNumber(createUserDto);
    return this.mapToUserResponseDto(user);
  }

  @Get()
  async findAll(@Query() query: UserQueryDto): Promise<{ data: UserResponseDto[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return this.mapToUserResponseDto(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return this.mapToUserResponseDto(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;
    return userData;
  }
}
