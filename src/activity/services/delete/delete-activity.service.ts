import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityEntity } from "../../models/activity.entity";
import { Logger } from "../../../common/logger/logger";
import { ErrorActivityNotFound } from "../../errors/not-found.exception";
export class DeleteActivityService {
  private logger = new Logger();
  private activityRepository: Repository<ActivityEntity>;

  constructor() {
    this.activityRepository = DBSource.getRepository(ActivityEntity);
  }

  async delete(idOwner: number, idSchedule: number, idActivity: number) {
    const activity = await this.activityRepository.findOne({
      where: { id: idActivity, idOwner, schedule: { id: idSchedule } }, 
    });

    if (!activity) {
      this.logger.log(
        `Activity with ID ${idActivity} not found or does not belong to owner with ID ${idOwner}`
      );
      throw new ErrorActivityNotFound(idActivity);
    }

    await this.activityRepository.remove(activity);
    this.logger.log(`Activity with ID ${idActivity} has been deleted`);

    return activity;
  }
}

export const deleteActivityService = new DeleteActivityService();
