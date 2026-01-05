import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Chercher l'utilisateur par email
    const user = await this.usersService.findOneByEmail(loginDto.email);
    
    // 2. Si l'utilisateur n'existe pas -> Erreur
    if (!user) {
        throw new UnauthorizedException('Identifiants incorrects');
    }

    // 3. Comparer le mot de passe fourni avec le hash en base
    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 4. Générer le Token JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          email: user.email,
          role: user.role
      }
    };
  }
}