import { UpdateScheduleService } from "./update-schedule.service";
import { ScheduleEntity } from "../../models/schedule.entity";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";
import { mockScheduleEntity } from "../../mocks/mock-schedule";
import { DBSource } from "../../../clients/PostgresDB/data-source.client";

jest.mock("../../../clients/PostgresDB/data-source.client");

describe("UpdateScheduleService", () => {
  let updateScheduleService: UpdateScheduleService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn().mockResolvedValue(mockScheduleEntity()),
      findOne: jest.fn().mockResolvedValue(mockScheduleEntity()),
      save: jest.fn().mockResolvedValue(mockScheduleEntity()),
      create: jest.fn().mockResolvedValue(new ScheduleEntity()),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    updateScheduleService = new UpdateScheduleService();
    jest.clearAllMocks();
  });

  it("should update an existing schedule", async () => {
    const idOwner = 1;
    const id = 1;
    const scheduleDto = {
      name: "Updated Schedule",
      url: "Updated.png",
    };

    const existingSchedule = mockScheduleEntity();
    jest
      .spyOn(mockRepository, "save")
      .mockReturnValue({ ...existingSchedule, ...scheduleDto });
    const updatedSchedule = await updateScheduleService.update(
      idOwner,
      id,
      scheduleDto
    );

    expect(updatedSchedule).toEqual({ ...existingSchedule, ...scheduleDto });
  });

  it("should throw an error if the schedule does not exist", async () => {
    const idOwner = 1;
    const id = 1;
    const scheduleDto = {
      name: "Updated Schedule",
      url: "Updated.png",
    };

    jest.spyOn(mockRepository, "findOne").mockReturnValue(null);
    await expect(
      updateScheduleService.update(idOwner, id, scheduleDto)
    ).rejects.toThrow(ErrorScheduleNotFound);
  });
});
