import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ScheduleEntity } from "../../models/schedule.entity";
import { ScheduleDto } from "../../dtos/schedule.dto";
import { Logger } from "../../../common/logger/logger";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";

export class UpdateScheduleService {
  private scheduleRepository: Repository<ScheduleEntity>;
  private logger = new Logger();

  constructor() {
    this.scheduleRepository = DBSource.getRepository(ScheduleEntity);
  }

  async update(idOwner: number, id: number, scheduleDto: ScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, idOwner },
    });

    if (!schedule) {
      this.logger.log(
        `Schedule with ID ${id} not found or does not belong to owner with ID ${idOwner}`
      );
      throw new ErrorScheduleNotFound(id);
    }

    Object.assign(schedule, scheduleDto);

    const updatedSchedule = await this.scheduleRepository.save(schedule);
    this.logger.log(`Schedule with ID ${id} has been updated`);

    return updatedSchedule;
  }
}

export const updateScheduleService = new UpdateScheduleService();
