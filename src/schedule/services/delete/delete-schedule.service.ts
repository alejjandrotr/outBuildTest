import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ScheduleEntity } from "../../models/schedule.entity";
import { Logger } from "../../../common/logger/logger";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";
import { ActivityEntity } from "../../../activity/models/activity.entity";

export class DeleteScheduleService {
  private scheduleRepository: Repository<ScheduleEntity>;
  private activityRepository: Repository<ActivityEntity>;

  private logger = new Logger();

  constructor() {
    this.scheduleRepository = DBSource.getRepository(ScheduleEntity);
    this.activityRepository = DBSource.getRepository(ActivityEntity);
  }

  async delete(idOwner: number, id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, idOwner },
      relations: ["activities"],
    });

    if (!schedule) {
      this.logger.log(
        `Schedule with ID ${id} not found or does not belong to owner with ID ${idOwner}`
      );
      throw new ErrorScheduleNotFound(id);
    }

    if (schedule.activities) {
      await this.activityRepository.remove(schedule.activities);
      this.logger.log(`Deleted activities associated with schedule ID ${id}`);
    }

    await this.scheduleRepository.remove(schedule);
    this.logger.log(`Schedule with ID ${id} has been deleted`);

    return schedule;
  }
}

export const deleteScheduleService = new DeleteScheduleService();
