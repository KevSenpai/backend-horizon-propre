import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: hash,
    });

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  // --- CORRECTION ICI : On autorise le retour 'null' ---
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
  // ----------------------------------------------------

  async createAdmin(email: string, pass: string) {
    const existing = await this.findOneByEmail(email);
    if (existing) {
        return { message: "L'admin existe déjà" };
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);

    const user = this.usersRepository.create({
      email,
      password_hash: hash,
      role: UserRole.ADMIN,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(updateUserDto.password, salt);
        const { password, ...rest } = updateUserDto;
        return this.usersRepository.update(id, { ...rest, password_hash: hash });
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}