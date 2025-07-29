import { UsersRepository } from "../../infraestructure/repositories/users/users-repository";
import { comparePassword } from "../../lib/hash-password";
import { JwtHelper } from "../../lib/jwt-helper";

export class AuthService {

    static async login(username: string, password: string) {
        const user = await UsersRepository.getUserByUsername(username);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const {email} = user;

        const token = await JwtHelper.signJwt({username, email})

        return {
            token
        };
    }

}