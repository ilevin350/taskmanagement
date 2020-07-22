import { Repository, EntityRepository, QueryFailedError } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthSigninDto } from "./dto/auth-signin.dto";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthSigninDto> {
    let result: AuthSigninDto = { success: true, message: '', accessToken: '' };
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
        result.success = false;
        result.message = 'Username already exists'
      }
      else {
        result.success = false;
        result.message = error.message;
      }
    }
    
    return result;
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto, jwtService: JwtService): Promise<AuthSigninDto> {
    let result: AuthSigninDto = { success: true, message: '', accessToken: '' };
    const {username, password} = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      result.message = `${user.username} signed in successfully`;
      const payload: JwtPayload = { username: user.username }
      result.accessToken = jwtService.sign(payload);
    }
    else {
      result.success = false;
      result.message = 'invalid credentials';
    }

    return result;
  }

  private async getHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}