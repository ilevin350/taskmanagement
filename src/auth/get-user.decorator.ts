import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthValidateDto } from "./dto/auth-validate.dto";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): AuthValidateDto => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.user;
});