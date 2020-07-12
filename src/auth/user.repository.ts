import { Repository, EntityRepository, QueryFailedError } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthSignupDto } from "./dto/auth-signup.dto";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthSignupDto> {
    let authSignupDto: AuthSignupDto = { success: true, message: '', accessToken: '' };
    const {username, password} = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.getHash(password, user.salt);
    
    try {
      await user.save();
    }
    catch (error) {
      console.log("error code:", error.code);
      if (error.code === '23505') {
        authSignupDto.success = false;
        authSignupDto.message = 'Username already exists'
      }
      else {
        authSignupDto.success = false;
        authSignupDto.message = error.message;
      }
    }
    
    return authSignupDto;
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto, jwtService: JwtService): Promise<AuthSignupDto> {
    let authSignupDto: AuthSignupDto = { success: true, message: '', accessToken: '' };
    let message: string = null;
    const {username, password} = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      authSignupDto.message = `${user.username} signed in successfully`;
      const payload: JwtPayload = { username: user.username }
      authSignupDto.accessToken = jwtService.sign(payload);
    }
    else {
      authSignupDto.success = false;
      authSignupDto.message = 'invalid credentials';
    }

    return authSignupDto;
  }

  private async getHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}