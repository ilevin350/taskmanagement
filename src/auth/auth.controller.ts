import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto): Promise<AuthSignupDto> {
    return this.authService.signUp(authCredendialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredendialsDto: AuthCredentialsDto): Promise<AuthSignupDto> {
    return this.authService.signIn(authCredendialsDto);
  }
}
