import { sign, verify, decode } from "hono/jwt";
import { Envs } from "../constants/envs";
import { LOGIN_JWT_DURATION } from "../constants/jwt-duration";

export class JwtHelper {

    
  static async signJwt(payload: any) {
    const token = await sign({...payload, exp: LOGIN_JWT_DURATION}, Envs.JWT_SECRET );

    return token;
  };

  static verifyJwt(token: string) {
      return verify(token, Envs.JWT_SECRET);
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
