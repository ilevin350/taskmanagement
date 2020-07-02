import { Repository, EntityRepository, QueryFailedError } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {username, password} = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;
    
    try {
      await user.save();
    }
    catch (error) {
      console.log("error code:", error.code);
      // if (error.code === '23505') {
      //   throw new ConflictException('Username already exists');
      // }
      // else {
      //   // Throw a 500 error
      //   throw new InternalServerErrorException;
      // }
    }
    
  }
}