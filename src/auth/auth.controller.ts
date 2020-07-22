import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto): Promise<AuthSigninDto> {
    return this.authService.signUp(authCredendialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto): Promise<AuthSigninDto> {
    return this.authService.signIn(authCredendialsDto);
  }
}
