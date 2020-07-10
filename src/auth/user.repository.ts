import { Repository, EntityRepository, QueryFailedError } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthSignupDto } from "./dto/auth-signup.dto";
import * as bcrypt from "bcrypt"

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthSignupDto> {
    let authSignupDto: AuthSignupDto = {success: true, message: ''};
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

  private async getHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}