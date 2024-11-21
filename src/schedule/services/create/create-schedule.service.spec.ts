import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ScheduleDto } from "../../dtos/schedule.dto";
import { ScheduleEntity } from "../../models/schedule.entity";
import { CreateScheduleService } from "./create-schedule.service";
import { mockSchedule, mockScheduleEntity } from "../../mocks/mock-schedule";

jest.mock("../../../clients/PostgresDB/data-source.client");
describe("Create a Schedule", () => {
  let service: CreateScheduleService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(mockScheduleEntity()),
      create: jest.fn().mockResolvedValue(new ScheduleEntity()),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    service = new CreateScheduleService();
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("must create an schedule", async () => {
    const scheduleDto: ScheduleDto = mockSchedule();
    const result = await service.create(1, scheduleDto);
    expect(DBSource.getRepository).toHaveBeenCalledWith(ScheduleEntity);
    expect(mockRepository.create).toHaveBeenCalledWith({
      ...scheduleDto,
      idOwner: 1,
    });
    expect(result).toEqual(mockScheduleEntity());
  });

  it("should handle errors", async () => {
    const scheduleDto: ScheduleDto = mockSchedule();
    mockRepository.save.mockRejectedValueOnce(new Error("Database error"));
    await expect(service.create(1, scheduleDto)).rejects.toThrow(
      "Database error"
    );
  });
});
