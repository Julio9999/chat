import { HTTPException } from "hono/http-exception";

import { UsersRepository } from "../../infraestructure/repositories/users/users-repository";
import { comparePassword } from "../../lib/hash-password";
import { JwtHelper } from "../../lib/jwt-helper";

export class AuthService {
  static async login(username: string, password: string) {
    const user = await UsersRepository.getUserByUsername(username);

    if (!user) {
      throw new HTTPException(404, { message: "Usuario no encontrado" });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HTTPException(404, { message: "Credenciales inválidas" });
    }

    const { email } = user;

    const token = await JwtHelper.signJwt({ username, email });

    return {
      token,
    };
  }

  static async validateToken(token: string) {
    const payload = await JwtHelper.verifyJwt(token);

    if (!payload) {
      throw new HTTPException(401, { message: "Token inválido" });
    }

    const { username, email } = payload;

    return {
      username,
      email,
    };
  }
}
