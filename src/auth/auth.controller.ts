import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // On renvoie 200 OK au lieu de 201 Created
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}