import { UsersRepository } from "../../infraestructure/repositories/users/users-repository";
import { hashPassword } from "../../lib/hash-password";
import { IUser } from "./users-interfaces";

export class UsersService {

  static async createUser(data: IUser) {
    const passwordHash = await hashPassword(data.password);

    return await UsersRepository.createUser({
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role,
    });
  }

  static async getUserByEmail(email: string) {
    return await UsersRepository.getUserByEmail(email);
  }

  static async getUserByUsername(username: string) {
    return await UsersRepository.getUserByUsername(username);
  }

  static async getUserByEmailOrUsername(email: string, username: string) {
    return await UsersRepository.getUserByEmailOrUsername(email, username); 
  }

  static async getUserById(id: number) {
    return await UsersRepository.getUserById(id);
  }

  static async getAllUsers() {
    return await UsersRepository.getAllUsers();
  }

  static async updateUser(id: number, data: Partial<IUser>) {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
      delete updateData.password;
    }

    return await UsersRepository.updateUser(id, updateData);
  }

  static async deleteUser(id: number) {
    return await UsersRepository.deleteUser(id);
  }
}
