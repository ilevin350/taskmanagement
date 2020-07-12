import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';

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

  async validate(payload: JwtPayload): Promise<AuthSignupDto> {
    let authSignupDto: AuthSignupDto = { success: true, message: '', accessToken: '' }
    const { username } = payload;
    const user = await this.userRepository.findOne({username});
    
    if (!user) {
      authSignupDto.success = false;
      authSignupDto.message = 'User not found';
    } else {
      authSignupDto.message = `Username: ${user.username}`;
    }

    return authSignupDto;
  }
} 