import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard, Roles, UserRole, Profile, CreateUserDto, PageOptionsDto } from '@app/common';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @Roles(UserRole.OPERATOR)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @Roles(UserRole.OPERATOR)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put('me/profile')
  async updateOwnProfile(
    @Req() req: Request,
    @Body() updateData: Partial<Profile>,
  ) {
    const user = req.user as { id: string };
    return this.usersService.updateProfile(user.id, updateData);
  }

  @Put(':id/profile')
  @Roles(UserRole.OPERATOR)
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<Profile>,
  ) {
    return this.usersService.updateProfile(id, updateData);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.OPERATOR)
  async deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivateUser(id);
  }
}
