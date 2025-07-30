import { sign, verify, decode } from "hono/jwt";
import { LOGIN_JWT_DURATION } from "../constants/jwt-duration";
import { Envs } from "../constants/envs";

export class JwtHelper {

    
  static async signJwt(payload: any) {
    const token = await sign({...payload, exp: LOGIN_JWT_DURATION}, Envs.JWT_SECRET );

    return token;
  };

  static async verifyJwt(token: string) {
      return await verify(token, Envs.JWT_SECRET);
  };

  static async decodeJwt(token: string) {
    try {
      const decoded = decode(token);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
