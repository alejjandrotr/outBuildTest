import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { DBSource } from "../../clients/PostgresDB/data-source.client";
import { UserEntity } from "../models/user.entity";
import { UserDto } from "../dtos/user.dto";
import { CONFIG_VARS } from "../../common/configs/config";
import { ErrorInvalidCredentials } from "../errors/ErrorInvalidCredentials.exception";

export class LoginService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = DBSource.getRepository(UserEntity);
  }

  async login(userDto: UserDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (!user || !user.password) {
      throw new ErrorInvalidCredentials();
    }

    const isMatch = await bcrypt.compare(userDto.password || "", user.password);
    if (!isMatch) {
      throw new ErrorInvalidCredentials();
    }

    const token = sign({ id: user.id }, CONFIG_VARS.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token };
  }
}

export const loginService = new LoginService();
