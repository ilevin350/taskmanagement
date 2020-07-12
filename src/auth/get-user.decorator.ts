import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthSignupDto } from "./dto/auth-signup.dto";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): AuthSignupDto => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});