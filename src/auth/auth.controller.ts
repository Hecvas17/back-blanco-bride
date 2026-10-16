import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from './auth.decorator';
import { LoginDto } from './auth.dto';
import { AuthService, AuthUser } from './auth.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Get('me')
  me(@Req() request: AuthenticatedRequest) { return this.auth.me(request.user.id); }
}
