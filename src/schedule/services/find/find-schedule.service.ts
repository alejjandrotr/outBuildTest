import { Repository } from "typeorm";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";
import { ScheduleEntity } from "../../models/schedule.entity";
import { ActivityEntity } from "../../../activity/models/activity.entity";
import { PaginatedDto, PaginateDto } from "../../../common/dtos/paginate.dto";
import { Schedule } from "../../models/schedule.interface";
import { Logger } from "../../../common/logger/logger";
import { ErrorScheduleGetShedule } from "../../errors/get-schedule.exception";

export class FindScheduleService {
  private scheduleRepository: Repository<ScheduleEntity>;
  private activityRepository: Repository<ActivityEntity>;
  private logger = new Logger();

  constructor() {
    this.scheduleRepository = DBSource.getRepository(ScheduleEntity);
    this.activityRepository = DBSource.getRepository(ActivityEntity);
  }

  async findAllUserSchedule(idOwner: number) {
    try {
      console.log({ idOwner });
      const schedule = await this.scheduleRepository.find({
        where: { idOwner },
      });
      return schedule;
    } catch (e) {
      throw new ErrorScheduleGetShedule(idOwner);
    }
  }

  async findOneBy(idOwner: number, id: number) {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id, idOwner },
      });
      if (!schedule) {
        throw new ErrorScheduleNotFound(id);
      }
      return schedule;
    } catch (e) {
      throw new ErrorScheduleNotFound(id);
    }
  }

  async findOneWithActivities(
    idOwner: number,
    id: number,
    pagina: PaginateDto = new PaginateDto()
  ): Promise<Schedule & PaginatedDto> {
    const schedule = await this.findOneBy(idOwner, id);
    try {
      const activities = await this.activityRepository.find({
        where: { schedule: schedule },
        skip: (pagina.page - 1) * (pagina.pageSize + 1),
        take: pagina.pageSize,
      });
      return { ...schedule, activities, meta: PaginateDto.getMetaData(pagina) };
    } catch (e) {
      this.logger.error("Error al obtener las actividades ", e);
      throw new ErrorScheduleNotFound(id);
    }
  }
}

export const finderScheduleService = new FindScheduleService();
