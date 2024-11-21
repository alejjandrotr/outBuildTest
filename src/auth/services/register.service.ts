import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { validate } from "class-validator";
import { DBSource } from "../../clients/PostgresDB/data-source.client";
import { UserEntity } from "../models/user.entity";
import { UserDto } from "../dtos/user.dto";
import { ErrorUserAlredyExist } from "../errors/UserAlredyExiste.exception";

export class RegisterService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = DBSource.getRepository(UserEntity);
  }

  async register(userDto: UserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new ErrorUserAlredyExist(userDto.email);
    }

    const hashedPassword = await bcrypt.hash(userDto.password || "", 10);
    const user = this.userRepository.create({
      email: userDto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return user;
  }
}

export const registerService = new RegisterService();
