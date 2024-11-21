import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityEntity } from "../../models/activity.entity";
import { ActivityDto } from "../../dtos/activity.dto";
import { Logger } from "../../../common/logger/logger";
import { ErrorActivityNotFound } from "../../errors/not-found.exception";

export class UpdateActivityService {
  private logger = new Logger();
  private activityRepository: Repository<ActivityEntity>;

  constructor() {
    this.activityRepository = DBSource.getRepository(ActivityEntity);
  }

  async update(
    idOwner: number,
    idSchedule: number,
    idActivity: number,
    activityDto: ActivityDto
  ) {
    const activity = await this.activityRepository.findOne({
      where: { id: idActivity, idOwner, schedule: { id: idSchedule } },
    });

    if (!activity) {
      this.logger.log(
        `Activity with ID ${idActivity} not found or does not belong to owner with ID ${idOwner}`
      );
      throw new ErrorActivityNotFound(idActivity);
    }

    Object.assign(activity, activityDto);

    const updatedActivity = await this.activityRepository.save(activity);
    this.logger.log(`Activity with ID ${idActivity} has been updated`);

    return updatedActivity;
  }
}

export const updateActivityService = new UpdateActivityService();
