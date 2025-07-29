import { sign, verify, decode } from "hono/jwt";

export class JwtHelper {

   private static getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no está definido en las variables de entorno");
    return secret;
  }
    
  static async signJwt(payload: any) {
    const token = await sign({...payload, exp: Math.floor(Date.now() / 1000) + 60 * 5}, this.getSecret(), );

    return token;
  };

  static async verifyJwt(token: string) {
    try {
      const decoded = await verify(token, this.getSecret());
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
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
