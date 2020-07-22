import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthService } from './auth.service';
import { AuthValidateDto } from './dto/auth-validate.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Area51'
    });
  }

  // Any controller action that is "guarded" will call this function.
  // The result will be injected into the HTTP request by means of
  // our @GetUser() custom decorator.
  async validate(payload: JwtPayload): Promise<AuthValidateDto> {
    let authValidateDto: AuthValidateDto = { success: true, message: '', accessToken: '', user: null }
    const { username } = payload;
    const user = await this.userRepository.findOne({username});
    
    if (!user) {
      authValidateDto.success = false;
      authValidateDto.message = 'User not found';
    } else {
      authValidateDto.message = `${user.username} validated successfully`;
      authValidateDto.user = user;
    }

    return authValidateDto;
  }
} 