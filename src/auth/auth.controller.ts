import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

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

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: AuthSignupDto) {
    console.log("user: ", user);
  }
}
