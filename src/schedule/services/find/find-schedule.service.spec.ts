import { mockActivity } from "../../../activity/mocks/mock-activity";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { PaginateDto } from "../../../common/dtos/paginate.dto";
import { ScheduleDto } from "../../dtos/schedule.dto";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";
import { mockSchedule } from "../../mocks/mock-schedule";
import { ScheduleEntity } from "../../models/schedule.entity";
import { FindScheduleService } from "./find-schedule.service";

jest.mock("../../../clients/PostgresDB/data-source.client");
describe("Create a Schedule", () => {
  let service: FindScheduleService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest
        .fn()
        .mockResolvedValue([mockActivity(), mockActivity(), mockActivity()]),
      findOne: jest.fn().mockResolvedValue({
        name: "Schedule 1",
        url: "imagen.png",
      }),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValue(mockRepository);
    service = new FindScheduleService();
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("must find an schedule", async () => {
    const result = await service.findOneBy(1);
    expect(DBSource.getRepository).toHaveBeenCalledWith(ScheduleEntity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockSchedule());
  });

  it("must find an schedule with activities", async () => {
    const result = await service.findOneWithActivities(1);
    expect(DBSource.getRepository).toHaveBeenCalledWith(ScheduleEntity);
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockSchedule(),
      activities: [mockActivity(), mockActivity(), mockActivity()],
      meta: new PaginateDto().getMetaData(),
    });
  });

  it("should handle database errors", async () => {
    const scheduleDto: ScheduleDto = mockSchedule();
    mockRepository.findOne.mockRejectedValueOnce(new Error("Database error"));
    await expect(service.findOneBy(1)).rejects.toThrow(ErrorScheduleNotFound);
  });

  it("should not found errors", async () => {
    const scheduleDto: ScheduleDto = mockSchedule();
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOneBy(1)).rejects.toThrow(ErrorScheduleNotFound);
  });
});
