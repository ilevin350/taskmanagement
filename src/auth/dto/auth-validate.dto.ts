import { User } from "../user.entity";

export class AuthValidateDto {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}