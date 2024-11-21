import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityEntity } from "../../models/activity.entity";
import { ActivityDto } from "../../dtos/activity.dto";
import {
  finderScheduleService,
  FindScheduleService,
} from "../../../schedule/services/find/find-schedule.service";
import { Logger } from "../../../common/logger/logger";
import { error } from "winston";

export class CreateActivityService {
  public finderSchedule: FindScheduleService;
  private logger = new Logger();
  private activityRepository: Repository<ActivityEntity>;

  constructor() {
    this.finderSchedule = finderScheduleService;
    this.activityRepository = DBSource.getRepository(ActivityEntity);
  }

  async create(idOwner: number, idSchedule: number, activityDto: ActivityDto) {
    const results = (
      await this.createMany(idOwner, idSchedule, [activityDto])
    ).pop();
    return results;
  }

  async createMany(
    idOwner: number,
    idSchedule: number,
    activitiesDto: ActivityDto[]
  ) {
    this.logger.log(
      `Iniciando proceso de registro de ${activitiesDto.length} actividades en el schedule ${idSchedule}`
    );
    const schedule = await this.finderSchedule.findOneBy(idOwner, idSchedule);
    const activities = activitiesDto.map((ac) =>
      this.activityRepository.create({ ...ac, schedule, idOwner })
    );
    const activitiesResult = await DBSource.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          const activity = await transactionalEntityManager.save(activities);
          this.logger.log(
            `Se ha registrado ${activitiesDto.length} nueva actividad en el schedule ${idSchedule}`
          );
          return activity;
        } catch (error) {
          this.logger.error(
            `Ha ocurrido un error al registrar la actividad en el schedule ${idSchedule}`,
            error
          );
          throw error;
        }
      }
    );
    return activitiesResult;
  }
}

export const createActivityService = new CreateActivityService();
