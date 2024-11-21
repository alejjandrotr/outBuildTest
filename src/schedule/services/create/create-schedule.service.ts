import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ScheduleEntity } from "../../models/schedule.entity";
import { ScheduleDto } from "../../dtos/schedule.dto";
import { Logger } from "../../../common/logger/logger";

export class CreateScheduleService {
  private scheduleRepository: Repository<ScheduleEntity>;
  private logger = new Logger();

  constructor() {
    this.scheduleRepository = DBSource.getRepository(ScheduleEntity);
  }

  async create(idOwner: number, scheduleDto: ScheduleDto) {
    const schedule = this.scheduleRepository.create({
      ...scheduleDto,
      idOwner,
    });
    const results = await this.scheduleRepository.save(schedule);
    this.logger.log(`Se ha registrado un nuevo schedule`);
    return results;
  }
}

export const createScheduleService = new CreateScheduleService();
